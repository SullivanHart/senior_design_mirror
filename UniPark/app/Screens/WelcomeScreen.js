import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

function WelcomeScreen(props) {

    function loginHandler() {console.log("Login Pressed")} // Replace console.log() with screen functionality
    function registerHandler() {console.log("Register Pressed")}

    return (
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/images/BackgroundPlaceholder.jpg')}
        >
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/PlaceholderIcon.png')} style={styles.logo} />
                <Text style={styles.text}> Placeholder Slogan </Text>
            </View>
            
            <Pressable style={styles.loginButton} onPress={loginHandler}>
                <Text style={styles.text}> Login </Text>
            </Pressable>
            <Pressable style={styles.registerButton} onPress={registerHandler}>
                <Text style={styles.text}> Register </Text>
            </Pressable>
        </ImageBackground>


    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
    },
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: '#fc5c65',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButton: {
        width: '100%',
        height: 70,
        backgroundColor: '#4ecdc4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        
    },
    logoContainer: {
        position: 'absolute',
        top: 70,
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 22,
    },
})

export default WelcomeScreen;