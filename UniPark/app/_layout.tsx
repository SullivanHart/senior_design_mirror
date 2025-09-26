import { Stack } from 'expo-router';
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { StripeProvider } from '@stripe/stripe-react-native';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import { AuthProvider } from './components/AuthProvider';

export default function Layout() {
  const router = useRouter();

  // useEffect(() => {
  //   router.replace("./Screens/WelcomeScreen"); // Redirect to Welcome screen
  // }, []);

  const [publishableKey, setPublishableKey] = useState('');

    useEffect(() => {
      const fetchKey = async () => {
        try {
          const response = await axios.get('http://sddec25-09e.ece.iastate.edu:8080/api/stripe/publishable-key');
          setPublishableKey(response.data.publishableKey);  
        } catch (error) {
          console.error('Failed to fetch publishable key:', error);
        }
      };
  
      fetchKey();
    }, []);

  return (
    <AuthProvider>
      <PaperProvider>
        <StripeProvider
          publishableKey={publishableKey}
          merchantIdentifier="merchant.identifier" // required for Apple Pay
          urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
          <Stack />
        </StripeProvider>
      </PaperProvider>
    </AuthProvider>
  );
}