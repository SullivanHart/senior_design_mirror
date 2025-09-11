import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Keyboard } from 'react-native';
import { Button, Text} from 'react-native-paper';
import { useRouter } from "expo-router";
import axios from 'axios';
import {initPaymentSheet, presentPaymentSheet} from '@stripe/stripe-react-native';
import BackButton from '../components/BackButton';

function PaymentScreen(props) {
    const router = useRouter();

    const lotId = 2; // adjust according to selected lot ID

    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(200);
    const [keyboardStatus, setKeyboardStatus] = useState(false);
 
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

      const createReservation = async () => {
        try {
          // dummy email for now, will eventually be a token
          const email = 'testemail@gmail.com';
      
          const response = await axios.post(`http://sddec25-09e.ece.iastate.edu:8080/api/reservations/${lotId}`, {
            email,
            parkingSpotId: 9// hardcoded for spot 1
          });
      
          alert(`Reservation created`);
        } catch (error) {
          console.error('Reservation failed:', error.response?.data || error.message);
          alert('Failed to create reservation');
        }
      };

    const initializePaymentSheet = async () => {
        setLoading(true);
    
        try {
          const clientSecret = await fetchPaymentIntentClientSecret(price);

    
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

    const handleReturn = () => {
      console.log("Back button pressed.");
      router.push('/Screens/ReserveScreen');
    }

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardStatus(false);
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);


    
    return (
        <View
          style={styles.background}
        >
            <BackButton onPress={handleReturn} />

            <View>
              <Text style={styles.titleText}>Checkout</Text>
              {!loading && 
                <Button
                  mode="contained-tonal"
                  onPress={initializePaymentSheet}
                  style={styles.button}
                >
                  Continue to Payment
                </Button> }
              {loading && <ActivityIndicator/>}
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    width: "100%", 
    marginBottom: 20, 
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 100,
  },
  text: {
    color: '#fff',
    textAlign: "center",
  },
  button: {
    // backgroundColor: 'dodgerblue',
    borderRadius: 20,
    marginTop: 10,
    padding: 5,
  }
});

export default PaymentScreen;