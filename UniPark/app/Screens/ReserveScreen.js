// necessary hooks and components from React
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'

// Reserve screen component
function ReserveScreen() {
  // initialize the router for navigation between screens
  const router = useRouter();
  const lotId = 2; // adjust according to selected lot ID

  const handleContinueToPayment = () => {
    // future navigation impementation to payment screen/handler
    router.push('/Screens/PaymentScreen');
   };

   const handleReturn = () => {
      router.push('./MapScreen');
   };

   

  //  const createReservation = async () => {
  //   try {
  //     // dummy email for now, will eventually be a token
  //     const email = 'testemail@gmail.com';
  
  //     const response = await axios.post(`http://sddec25-09e.ece.iastate.edu:8080/api/reservations/${lotId}`, {
  //       email,
  //       parkingSpotId: 8// hardcoded for spot 1
  //     });
  
  //     alert(`Reservation created`);
  //   } catch (error) {
  //     console.error('Reservation failed:', error.response?.data || error.message);
  //     alert('Failed to create reservation');
  //   }
  // };
  
  // state variables to store fetched data
  const [availableSpots, setAvailableSpots] = useState(null);
  const [cost, setCost] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true); // tracks loading status

 

  // fetch parking lot data when the component first mounts
  useEffect(() => {
    async function fetchLotData() {
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
      <Pressable style = {styles.backButton} onPress ={handleReturn}>
        <Text style ={styles.backButtonText}>Back</Text>
      </Pressable>
      <Text style={styles.heading}>Reserve a Parking Spot</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.label}>Available Spots:</Text>
        <Text style={styles.value}>{availableSpots}</Text>

        <Text style={styles.label}>Cost (per hour):</Text>
        <Text style={styles.value}>${cost}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{address}</Text>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={handleContinueToPayment}>
        <Text style={styles.paymentButtonText}>Continue to Payment</Text>
      </TouchableOpacity>

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
  backButton: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    marginTop: 10,
    padding: 5,
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 10
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  container: {
    flex: 1,
    padding: 20,
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
