import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { useRouter } from "expo-router";
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../components/AuthProvider'

export default function WelcomeScreen() {

    const router = useRouter();
    const auth = useAuth();
    
    function loginHandler() {router.push('Screens/LoginScreen')} 
    function registerHandler() {router.push('Screens/RegisterScreen')}

    return (
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/images/BackgroundPlaceholder.jpg')}
        >
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/PlaceholderIcon.png')} style={styles.logo} />
                <Text
                    style={styles.text}
                    variant='labelLarge'
                > Placeholder Slogan </Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={loginHandler} style={styles.button}>
                    Login
                </Button>
                <Button mode="contained" onPress={registerHandler} style={styles.button}>
                    Register
                </Button>
            </View>
        </ImageBackground>


    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        alignItems: 'center'
    },
        buttonContainer: {
        marginTop: 40, // space between logo and buttons
        width: '80%',
        alignItems: 'center',
    },
    button: {
        marginTop: 10, // space between buttons
        width: '100%',
    },
    text: {
        color: '#fff',
    }
})
