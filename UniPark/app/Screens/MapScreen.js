import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';

function MapScreen() {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [availableSpots, setAvailableSpots] = useState(null);
  const [region, setRegion] = useState({
    latitude: 42.02962944614904, // Ames, Iowa
    longitude: -93.65165725516594,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const parkingLocation = {
    latitude: 42.02962944614904,
    longitude: -93.65165725516594,
    availableSpots: availableSpots != null ? availableSpots : '...',
    lotName: "The Armory",
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync();
      setLocation(currentLocation);

      try {
        const response = await fetch('http://sddec25-09e.ece.iastate.edu:8080/api/parkingspots/lot/2'); 
        const data = await response.json();
        const available = data.filter(spot => spot.status === 'EMPTY').length;
        setAvailableSpots(available);
      } catch (error) {
        console.error('Failed to fetch parking spots:', error);
        setAvailableSpots('Error');
      }
    })();
  }, []);

  const onRegionChangeComplete = useCallback((newRegion) => {
    setRegion(newRegion);
  }, []);

  const handleReservePress = () => {
    // Future implementation of reservation page navigation
    // router.push('/Reserve');
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation={true}
          >
            <Marker coordinate={parkingLocation}>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.lotName}>{parkingLocation.lotName}</Text>
                  <Text>{`Available Spots: ${parkingLocation.availableSpots}`}</Text>
                  <TouchableOpacity style={styles.reserveButton} onPress={handleReservePress}>
                    <Text style={styles.reserveButtonText}>Reserve</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          </MapView>

          {/* Future implementation: SearchBar component can be inserted here */}
          {/* <View style={styles.searchbarContainer}>
               <SearchBar />
             </View> */}

        </>
      ) : (
        <ActivityIndicator animating={true} size={100} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 150,
    padding: 10,
    alignItems: 'center',
  },
  lotName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  reserveButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  // some placeholder styles for future SearchBar
  searchbarContainer: {
    position: 'absolute',
    top: '2.5%',
    width: '95%',
    alignSelf: 'center',
  },
});

export default MapScreen;