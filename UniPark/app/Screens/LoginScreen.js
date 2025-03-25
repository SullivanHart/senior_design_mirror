import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from "expo-router";

function LoginScreen(props) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("")


    return (
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/images/BackgroundPlaceholder.jpg')} 
        >
            
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/PlaceholderIcon.png')} style={styles.logo} />
                <Text style={styles.text}> Login </Text>
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.formContainer} >
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(newText) => setEmail(newText)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={pass}
                        secureTextEntry={true}
                        onChangeText={(newText) => setPass(newText)}
                    />
                </View>
            </TouchableWithoutFeedback>
            


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
        position: 'absolute',
        top: 100,
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 22,
    },  
    input: {
        width: '60%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
      },
    formContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%',
        //backgroundColor: '#fff'
    },
});

export default LoginScreen;