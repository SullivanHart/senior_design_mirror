// necessary hooks and components from React
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {initPaymentSheet, presentPaymentSheet} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackButton from '../components/BackButton';
import MapView, { Polygon } from 'react-native-maps';

// Reserve screen component
function ReserveScreen() {
  // initialize the router for navigation between screens
  const router = useRouter();
  const lotId = 2; // adjust according to selected lot ID

   const handleReturn = () => {
      router.push('Screens/MapScreen');
   };

  const fetchPaymentIntentClientSecret = async (amountInCents) => {
    try {
      const response = await axios.post('http://sddec25-09e.ece.iastate.edu:8080/api/payments/create-payment-intent', {
        amount: amountInCents, // e.g., 1099 for $10.99
        currency: 'usd',
        paymentMethodType: 'card',
      });

      //console.log('got response back and got ', response.data.clientSecret);
  
      return response.data.clientSecret;
    } catch (error) {
      console.error('Error creating PaymentIntent:', error.response?.data || error.message);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
      setLoading(true);
  
      try {
        const clientSecret = await fetchPaymentIntentClientSecret(cost);
  
        // Wrap only initPaymentSheet in its own try/catch
        let initError;
        try {
          const result = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'UniPark',
            googlePay: {
              merchantCountryCode: 'US',  // Must match your business country
              currencyCode: 'USD',
              testEnv: true, // Set to false in production
            },
          });
          initError = result?.error;
        } catch (e) {
          console.error('Exception thrown during initPaymentSheet:', e);
          Alert.alert('Stripe Init Error', e.message || 'Unknown error during init.');
          setLoading(false);
          return;
        }

        if (initError) {
          console.error('Init PaymentSheetError ', initError);
          Alert.alert('Error', initError.message);
          setLoading(false);
          return;
        }
  
        const { error: presentError } = await presentPaymentSheet();
  
        if (presentError) {
          Alert.alert('Payment failed', presentError.message);
        } else {
          Alert.alert('Success', 'Your payment was confirmed!');

          await createReservation();
          router.push('Screens/MapScreen');
        }
      } catch (err) {
        Alert.alert('Something went wrong', err.message);
      } finally {
        setLoading(false);
      }

      
  };


  const createReservation = async () => {
    try {
      // dummy email for now, will eventually be a token
      const email = 'testemail@gmail.com';
  
      const response = await axios.post(`http://sddec25-09e.ece.iastate.edu:8080/api/reservations/${lotId}`, {
        email,
        parkingSpotId: 8// hardcoded for spot 1
      });
  
      alert(`Reservation created`);
    } catch (error) {
      console.error('Reservation failed:', error.response?.data || error.message);
      alert('Failed to create reservation');
    }
  };
  
  // state variables to store fetched data
  const [availableSpots, setAvailableSpots] = useState(null);
  const [cost, setCost] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true); // tracks loading status

  // hard-coded demo blocks for live map
  const [region, setRegion] = useState(null);
  const [blocks, setBlocks] = useState([]);

  // setting fillColor based on capacity of parking blocks
  const getBlockColors = (ratio) => {
  if (ratio == null || isNaN(ratio)) {
    return { fillColor: 'rgba(120,120,120,0.25)', strokeColor: 'rgba(120,120,120,0.9)' };
  }
  if (ratio < 0.60) return { fillColor: 'rgba(0,180,0,0.25)',   strokeColor: 'rgba(0,120,0,0.9)' };
  if (ratio < 0.90) return { fillColor: 'rgba(255,165,0,0.25)', strokeColor: 'rgba(200,120,0,0.9)' };
  return                         { fillColor: 'rgba(220,0,0,0.25)',     strokeColor: 'rgba(160,0,0,0.9)' };
};

const computeRegionFromCoords = (coords, {minLatDelta = 0.0004, minLngDelta = 0.0004} = {}) => {
  if (!coords || coords.length === 0) return null;
  let minLat =  90, maxLat = -90, minLng =  180, maxLng = -180;
  coords.forEach(({ latitude, longitude }) => {
    minLat = Math.min(minLat, latitude); maxLat = Math.max(maxLat, latitude);
    minLng = Math.min(minLng, longitude); maxLng = Math.max(maxLng, longitude);
  });
  const latDelta = Math.max(minLatDelta, (maxLat - minLat) * 1.4);
  const lngDelta = Math.max(minLngDelta, (maxLng - minLng) * 1.4);
  return {
    latitude:  (minLat + maxLat) / 2,
    longitude: (minLng + minLng) / 2,
    latitudeDelta:  latDelta,
    longitudeDelta: lngDelta,
  };
};

const getLotMapConfig = (lotId) => {
  const presets = {
    1: { lat: 42.0269, lng: -93.6469 },
    2: { lat: 42.0265, lng: -93.6465 }, 
    3: { lat: 42.0262, lng: -93.6461 },
  };
  return presets[lotId] ?? { lat: 42.0265, lng: -93.6465 };
};

  // fetch parking lot data when the component first mounts
  useEffect(() => {
    async function fetchLotData() {
      console.log('Fetching lot data...');
      try {
        // sends API requests simultaneously
        const [spotsRes, costRes, addressRes] = await Promise.all([
          fetch(`http://sddec25-09e.ece.iastate.edu:8080/api/parkingspots/lot/${lotId}`),
          fetch(`http://sddec25-09e.ece.iastate.edu:8080/api/parkinglots/${lotId}/cost`),
          fetch(`http://sddec25-09e.ece.iastate.edu:8080/api/parkinglots/${lotId}/address`),
        ]);

        // parse the API responses
        const spotsData = await spotsRes.json();
        const costData = await costRes.text();
        const addressData = await addressRes.text();

        // calculates number of available spots (status === 'EMPTY')
        const available = spotsData.filter(spot => spot.status === 'EMPTY').length;
        console.log(`Fetched lot data: ${available} available spots, cost: ${costData}, address: ${addressData}`);

        // update state with fetched data
        setAvailableSpots(available);
        setCost(costData);
        setAddress(addressData);
      } catch (error) {
        // logs errors in fetching process
        console.error('Failed to fetch lot data:', error);
      } finally {
        // set loading to false whether fetch succeeded or failed
        setLoading(false);
      }
    }

    fetchLotData(); // call the async function
  }, []);

  // 3 arbitrary spots 
useEffect(() => {
  const { lat: baseLat, lng: baseLng } = getLotMapConfig(lotId);

  // row of rectangles (each block = one row)
  const halfLat = 0.00005;  // thin (north-south)
  const halfLng = 0.00028;  // long (east-west)
  const rowGap  = 0.00026;  // vertical spacing between rows

  // helper to make a rectangle polygon from center + half-sizes
  const makeRect = (lat, lng, dLat, dLng) => ([
    { latitude: lat + dLat, longitude: lng - dLng },
    { latitude: lat + dLat, longitude: lng + dLng },
    { latitude: lat - dLat, longitude: lng + dLng },
    { latitude: lat - dLat, longitude: lng - dLng },
  ]);

  // stack 3 adjacent rows within the lot
  const row1Lat = baseLat + rowGap * 1.15;   // top row
  const row2Lat = baseLat;            // middle row
  const row3Lat = baseLat - rowGap * 1.15;   // bottom row
  const rowLng  = baseLng;

  const demoBlocks = [
    {
      id: `lot${lotId}-row1`,
      capacity: 20,
      occupied: 7,  // about 30% will show green
      polygon: makeRect(row1Lat, rowLng, halfLat, halfLng),
    },
    {
      id: `lot${lotId}-row2`,
      capacity: 22,
      occupied: 16, // about 70% shows orange
      polygon: makeRect(row2Lat, rowLng, halfLat, halfLng),
    },
    {
      id: `lot${lotId}-row3`,
      capacity: 18,
      occupied: 17, // >90% shows red
      polygon: makeRect(row3Lat, rowLng, halfLat, halfLng),
    },
  ];

  setBlocks(demoBlocks);

  // compute tighter region so rows appear large in scale
  const all = demoBlocks.flatMap(b => b.polygon);
  const r = computeRegionFromCoords(all, { minLatDelta: 0.00055, minLngDelta: 0.00055 });
  if (r) setRegion(r);
}, [lotId]);

  // shows a Loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // main UI rendering after the loading completes
  return (
    <View style={styles.container}>
      <BackButton onPress={handleReturn} />
    <Text style={styles.heading}>Reserve a Parking Spot</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.label}>Available Spots:</Text>
        <Text style={styles.value}>{availableSpots}</Text>

        <Text style={styles.label}>Cost (per hour):</Text>
        <Text style={styles.value}>${cost}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      {region && (
        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
          >
            {blocks.map((b) => {
              const capacity = Number(b?.capacity);
              const occupied = Number(b?.occupied);
              const ratio = capacity > 0 ? occupied / capacity : null;
              const { fillColor, strokeColor } = getBlockColors(ratio);
              const coords = Array.isArray(b?.polygon) ? b.polygon : [];
              if (coords.length < 3) return null;
              return (
                <Polygon
                  key={b.id ?? JSON.stringify(coords)}
                  coordinates={coords}
                  fillColor={fillColor}
                  strokeColor={strokeColor}
                  strokeWidth={1}
                  tappable
                />
              );
            })}
          </MapView>
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Capacity</Text>
            <View style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: 'rgba(0,180,0,0.25)', borderColor: 'rgba(0,120,0,0.9)'}]} />
              <Text style={styles.legendText}>{'<'} 60% full</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: 'rgba(255,165,0,0.25)', borderColor: 'rgba(200,120,0,0.9)'}]} />
              <Text style={styles.legendText}>60–89% full</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.swatch, { backgroundColor: 'rgba(220,0,0,0.25)', borderColor: 'rgba(160,0,0,0.9)'}]} />
              <Text style={styles.legendText}>{'\u2265'} 90% full</Text>
            </View>
          </View>
        </View>
      )}

      {!loading && 
        <Button
          mode="contained-tonal"
          textColor='white'
          onPress={initializePaymentSheet}
          style={styles.button}
        >
          Continue to Payment
      </Button> }

      {/* <TouchableOpacity
        style={[styles.paymentButton, { backgroundColor: 'dodgerblue', marginTop: 10 }]}
        onPress={createReservation}
      >
        <Text style={styles.paymentButtonText}>Create Reservation</Text>
      </TouchableOpacity> */}

    </View>
  );
}

// component specific styles created in StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  infoBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  mapWrapper: {
    height: 260,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#e9eef3',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  legend: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 2,
  },
  legendTitle: { fontWeight: '700', marginBottom: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  swatch: {
    width: 16, height: 16, borderRadius: 3, borderWidth: 1, marginRight: 6,
  },
  legendText: { fontSize: 12 },
  paymentButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReserveScreen;
