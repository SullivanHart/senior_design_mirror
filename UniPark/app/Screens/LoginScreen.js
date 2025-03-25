import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from "expo-router";

function LoginScreen(props) {
    const router = useRouter();


    return (
        <View>
            <Text>Login Screen</Text>
        </View>
    );
}

export default LoginScreen;