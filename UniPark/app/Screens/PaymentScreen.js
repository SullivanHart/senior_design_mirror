import React from 'react';
import { View } from 'react-native';

function PaymentScreen(props) {
    const [publishableKey, setPublishableKey] = useState('');

    const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
        setPublishableKey(key);
    };

    useEffect(() => {
        fetchPublishableKey();
    }, []);

    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.identifier" // required for Apple Pay
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
            
        </StripeProvider>
    );
}

export default PaymentScreen;