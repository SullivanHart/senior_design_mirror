import React, { useContext, useEffect, useState, createContext } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { login, logout, loginAndSaveUser } from "../services/api/Auth";
import { useRouter } from "expo-router";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        _autoLogin();
    }, []);

    const _autoLogin = async () => {
        try {
            const tokenString = await SecureStore.getItemAsync('userToken');
            if (tokenString) {
                const token = JSON.parse(tokenString);
                const response = await login({ email: token.email, password: token.password });
                if (response.status === 200) {
                    setUserToken({
                        email: String(token.email).toLowerCase(),
                        password: String(token.password)
                    });
                    Alert.alert('Success', `Logged in`);
                    router.push('Screens/MapScreen');
                } else {
                    await SecureStore.deleteItemAsync('userToken');
                }
            }

        } catch (error) {
            console.error('Auto-login failed:', error);
        }
    }

    const _login = async (values) => {
        try {
            const response = await login(values);
            if (response.status === 200) {
                setUserToken({
                    email: String(values.email).toLowerCase(),
                    password: String(values.password)
                });
                await SecureStore.setItemAsync('userToken', JSON.stringify({
                    email: String(values.email).toLowerCase(),
                    password: String(values.password)
                }));
            } else {
                setUserToken(null);
            }
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    const _logout = async () => {
        try {
            if (userToken) {
                // const response = await logout(userToken);
                await SecureStore.deleteItemAsync('userToken');
                setUserToken(null);
            } else {
                setUserToken(null);
                console.log('No token found, user is already logged out.');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const value = {
        userToken,
        _logout,
        _login,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )};

const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthContext, AuthProvider, useAuth };
export default AuthProvider;