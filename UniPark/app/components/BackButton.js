import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const BackButton = ({ onPress }) => {
    return (
        <Button mode="contained" 
            textColor='white' 
            buttonColor='FF0000' 
            style={styles.button} 
            onPress={onPress}>
            Back
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FF0000',
        marginTop: 10,
        position: 'absolute',
        top: 5,
        left: 5
    },
});

export default BackButton;
