import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { Formik } from 'formik';
import * as Yup from 'yup';

function LoginScreen(props) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("")

    const loginValidationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

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
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginValidationSchema}
                    onSubmit={(values) => {
                    Alert.alert(`Logged in as ${values.email}`);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.formContainer} >
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                        />
                        {touched.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={values.password}
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                        />
                        {touched.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

                        <Pressable  style={styles.submit} onPress={handleSubmit}>
                            <Text style={styles.text}> Submit </Text>
                        </Pressable>
                    </View>
                    )}
                </Formik>
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
        alignItems: 'center',
        padding: 10
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
    submit: {
        backgroundColor: 'dodgerblue',
        borderRadius: 20,
        marginTop: 10,
        padding: 5,
    },
});

export default LoginScreen;