import React, { useEffect, useState, useRef } from 'react';
import { View, ImageBackground, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useRouter } from "expo-router";
import { Formik } from 'formik';
import * as Yup from 'yup';
import BackButton from '../components/BackButton';
import { useAuth } from '../components/AuthProvider';

function LoginScreen(props) {
    const router = useRouter();
    const auth = useAuth();

    const loginValidationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(3, 'Password must be at least 3 characters').required('Password is required'),
    });

    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await auth._login(values);

            if (response.status !== 200) {
                throw new Error(response.data?.message || 'Login failed');
            }
            console.log('Login successful, response:', response.data);
            Alert.alert('Success', `Logged in`);
            router.replace('Screens/MapScreen');
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
        router.push('Screens/WelcomeScreen');
    }

    return (
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/images/BackgroundPlaceholder.jpg')} 
        >
            
            {!keyboardStatus &&
                <BackButton onPress={handleReturn} />
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
                            mode='outlined'
                            autoCapitalize='none'
                            theme={{ roundness: 20, }}
                            style={styles.input}
                            placeholder="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            submitBehavior='submit'
                            returnKeyType='next'
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />

                        {touched.email && errors.email &&
                            <Text style={{ color: 'red' }}>
                                {errors.email}
                            </Text>}

                        <TextInput
                            mode='outlined'
                            autoCapitalize='none'
                            theme={{ roundness: 20, }}
                            ref={passwordRef}
                            style={styles.input}
                            placeholder="Password"
                            value={values.password}
                            secureTextEntry={true}
                            onChangeText={handleChange('password')}
                            returnkey='done'
                            onSubmitEditing={handleSubmit}
                        />

                        {touched.password && errors.password && 
                            <Text style={{ color: 'red' }}>
                                {errors.password}
                            </Text>}


                        {errors.api && 
                            <Text style={{ color: 'red', marginBottom: 10 }}>
                                {errors.api}
                            </Text>}

                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Button mode="contained" textColor='white' style={styles.submit} onPress={handleSubmit}>
                                Submit
                            </Button>
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
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 20,
      },
    formContainer: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%',
        paddingBottom: 100,
    },
    submit: {
        width: '50%',
        marginTop: 10,
    },
});

export default LoginScreen;