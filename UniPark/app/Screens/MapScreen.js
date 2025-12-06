import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { ActivityIndicator, Text, Portal, Card, Button } from 'react-native-paper';
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
  const [showLotSheet, setShowLotSheet] = useState(false);

  const sheetTranslateY = useRef(new Animated.Value(260)).current;

  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: showLotSheet ? 0 : 260, 

      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showLotSheet, sheetTranslateY]);

  const parkingLocation = {
    latitude: 42.02962944614904,
    longitude: -93.65165725516594,
    availableSpots: availableSpots != null ? availableSpots : '...',
    lotName: "The Armory",
  };

  const lotId = 2; // adjust according to selected lot ID

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
        const response = await fetch(`http://sddec25-09e.ece.iastate.edu:8080/api/parkingspots/lot/${lotId}`); 
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
    setShowLotSheet(false);
    setTimeout(() => {
      router.push('/Screens/ReserveScreen');
    }, 260);
  };

  const handleMarkerPress = useCallback(() => {
    setShowLotSheet(true);
  }, []);


  const handleMapPress = useCallback(() => {
    setShowLotSheet(false);
  }, []);

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
            onPress={handleMapPress}
          >
            <Marker coordinate={parkingLocation} onPress={handleMarkerPress} />
          </MapView>

          
          <Portal>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.bottomSheet,
                { transform: [{ translateY: sheetTranslateY }] },
              ]}
            >
              <Card mode="elevated" style={styles.bottomCard} onPress={() => {}}>
                <Card.Title title={parkingLocation.lotName} />
                <Card.Content>
                  <Text>{`Available Spots: ${parkingLocation.availableSpots}`}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" onPress={handleReservePress}>Reserve</Button>
                </Card.Actions>
              </Card>
            </Animated.View>
          </Portal>

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
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  bottomCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 20,
  },
});

export default MapScreen;
