import React, { useEffect, useState, useRef } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View, TouchableWithoutFeedback, TextInput, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { useRouter } from "expo-router";
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

function RegisterScreen(props) {

    const router = useRouter();

    const registerValidationSchema = Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string().required('Password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
        });

        async function registerHandler(values, { setSubmitting, setErrors }) {
        
            try {
                const { email, password } = values;
                const response = await axios.post('http://sddec25-09e.ece.iastate.edu:8080/api/person/register', { email, password }, {
                    headers: { 'Content-Type': 'application/json' }
                });
            
                // Store user token
                // await AsyncStorage.setItem('userToken', response.data.user.token);
            
                Alert.alert('Registration complete. Please login.');
                router.push('./LoginScreen');
              } catch (error) {
                console.log('Error:', error.response?.data || error.message);
                console.log(values)
                setErrors({ api: error.response?.data?.message || 'Registration failed' });
              } finally {
                setSubmitting(false);
              }
        }
    

    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

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
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/images/BackgroundPlaceholder.jpg')}
        >
            {!keyboardStatus && <View style={styles.logoContainer}>
                            <Image source={require('../../assets/images/PlaceholderIcon.png')} style={styles.logo} />
                            <Text style={styles.text}> Register </Text>
                        </View>}
            
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <Formik
                                initialValues={{ email: '', password: '', confirmPassword: '', }}
                                validationSchema={registerValidationSchema}
                                onSubmit={registerHandler}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View style={styles.formContainer} >
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Email'
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        //onBlur={handleBlur('email')}
                                        submitBehavior='submit'
                                        returnKeyType='next'
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                    />
                                    {touched.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
            
                                    <TextInput
                                        ref={passwordRef}
                                        style={styles.input}
                                        placeholder='Password'
                                        value={values.password}
                                        secureTextEntry={true}
                                        onChangeText={handleChange('password')}
                                        //onBlur={handleBlur('password')}
                                        submitBehavior='submit'
                                        returnKeyType='next'
                                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                    />
                                    {touched.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

                                    <TextInput
                                        ref={confirmPasswordRef}
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        value={values.confirmPassword}
                                        secureTextEntry={true}
                                        onChangeText={handleChange('confirmPassword')}
                                        // onBlur={handleBlur('confirmPassword')}
                                        //submitBehavior='done'
                                        returnKeyType='done'
                                        onSubmitEditing={handleSubmit}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>}
            
                                    

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

export default RegisterScreen;