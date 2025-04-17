import React from 'react';
import { View } from 'react-native';

function PaymentScreen(props) {

    const fetchPaymentIntentClientSecret = async (amountInCents) => {
        try {
          const response = await axios.post('https://sddec25-09e.ece.iastate.edu:8080/api/payments/create-payment-intent', {
            amount: amountInCents, // e.g., 1099 for $10.99
            currency: 'usd',
            paymentMethodType: 'card',
          });
      
          return response.data.clientSecret;
        } catch (error) {
          console.error('Error creating PaymentIntent:', error.response?.data || error.message);
          throw error;
        }
    };

    const initializePaymentSheet = async () => {
        setLoading(true);
    
        try {
          const clientSecret = await fetchPaymentIntentClientSecret(1099);
    
          const { error: initError } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'UniPark',
          });
    
          if (initError) {
            Alert.alert('Error', initError.message);
            setLoading(false);
            return;
          }
    
          const { error: presentError } = await presentPaymentSheet();
    
          if (presentError) {
            Alert.alert('Payment failed', presentError.message);
          } else {
            Alert.alert('Success', 'Your payment was confirmed!');
          }
        } catch (err) {
          Alert.alert('Something went wrong', err.message);
        } finally {
          setLoading(false);
        }
    };

    
    return (
        <View>
            <Text style={{ fontSize: 22, marginBottom: 20 }}>Checkout</Text>
            <Button
                title="Pay $10.99"
                onPress={initializePaymentSheet}
                disabled={loading}
            />
            {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
        </View>
    );
}

export default PaymentScreen;