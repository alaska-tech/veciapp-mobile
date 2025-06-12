import React, { useEffect, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log("Current location:", latitude, longitude);
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005, // Más zoom que antes
          longitudeDelta: 0.005,
        });
      } catch (error) {
        setErrorMsg("Error getting location");
      } finally {
        setIsLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!region) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView initialRegion={region} style={styles.map}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
