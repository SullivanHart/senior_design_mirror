// necessary hooks and components from React
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {initPaymentSheet, presentPaymentSheet} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackButton from '../components/BackButton';

// Reserve screen component
function ReserveScreen() {
  // initialize the router for navigation between screens
  const router = useRouter();
  const lotId = 2; // adjust according to selected lot ID

  const handleContinueToPayment = () => {
    // future navigation impementation to payment screen/handler
    router.push('Screens/PaymentScreen');
   };

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
        console.log('got client secret back: ', clientSecret);
  
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
          console.log('initPaymentSheet result:', result);
          initError = result?.error;
        } catch (e) {
          console.error('Exception thrown during initPaymentSheet:', e);
          Alert.alert('Stripe Init Error', e.message || 'Unknown error during init.');
          setLoading(false);
          return;
        }
  
        console.log('finished initpaymentsheet');

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
