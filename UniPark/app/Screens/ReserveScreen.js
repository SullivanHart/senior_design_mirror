import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

function ReserveScreen() {
  const router = useRouter();

  const handleContinueToPayment = () => {
    // future navigation impementation to payment screen/handler
    // router.push('/Payment');
    alert('Continuing to payment...');
   };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reserve a Parking Spot</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.label}>Available Spots:</Text>
        <Text style={styles.value}>(Pull from database)</Text>

        <Text style={styles.label}>Cost:</Text>
        <Text style={styles.value}>(Pull from database)</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>(Pull from database)</Text>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={handleContinueToPayment}>
        <Text style={styles.paymentButtonText}>Continue to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
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
