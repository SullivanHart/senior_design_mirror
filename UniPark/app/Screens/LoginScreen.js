import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen(props) {
    const router = useRouter();

    const loginValidationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(3, 'Password must be at least 3 characters').required('Password is required'),
    });

    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('http://sddec25-09e.ece.iastate.edu:8080/api/person/login', values);

            // Store user token
            // await AsyncStorage.setItem('userToken', response.data.user.token);

            Alert.alert('Success', `Logged in`);
        } catch (error) {
            console.log('Error:', error.response?.data || error.message);
            console.log(values)
            setErrors({ api: error.response?.data?.message || 'Invalid login credentials' });
        } finally {
            setSubmitting(false);
        }
    }

    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const passwordRef = useRef(null);
    
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

    const handleReturn = () => {
        router.push('./WelcomeScreen');
    }

    return (
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/images/BackgroundPlaceholder.jpg')} 
        >
            
            {!keyboardStatus &&
                <Pressable style={styles.backButton} onPress={handleReturn}>
                    <Text style={styles.text}> Back </Text>
                </Pressable>
            }

            {!keyboardStatus && <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/PlaceholderIcon.png')} style={styles.logo} />
                <Text style={styles.text}> Login </Text>
            </View>}

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginValidationSchema}
                    onSubmit={handleLogin}              // This is where to add the API call for login
                >
                    {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View style={styles.formContainer} >
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            submitBehavior='submit'
                            returnKeyType='next'
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        {touched.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

                        <TextInput
                            ref={passwordRef}
                            style={styles.input}
                            placeholder="Password"
                            value={values.password}
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            returnkey='done'
                            onSubmitEditing={handleSubmit}
                        />
                        {touched.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                        

                        {errors.api && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.api}</Text>}

                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Pressable  style={styles.submit} onPress={handleSubmit}>
                                <Text style={styles.text}> Submit </Text>
                            </Pressable>
                        )}
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
    backButton: {
        backgroundColor: '#FF0000',
        borderRadius: 20,
        marginTop: 10,
        padding: 5,
        position: 'absolute',
        top: 5,
        left: 5
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