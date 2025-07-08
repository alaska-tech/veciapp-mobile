import React, { useEffect, useState } from "react";
import MapView, { Region } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import useCustomerAction from "~/actions/customer.action";
import { AddressLocation } from "~/constants/models";
import { Loader } from "~/components/ui/loader";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [adrress, setAdrress] = useState("");
  const [adrressError, setAdrressError] = useState(false);
  const [nickname, setNickname] = useState("");
  const customerActions = useCustomerAction();
  const addAddress = customerActions.addAddress();
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

  async function handleSubmit() {
    if (addAddress.isPending) {
      return;
    }
    if (!adrress) {
      setAdrressError(true);
      return;
    }
    const newAddress: AddressLocation = {
      address: adrress,
      alias: nickname,
      coordinates: [markerPosition.latitude, markerPosition.longitude], // lat, lng
    };
    console.log("New address submitted:", newAddress);
    try {
      await addAddress.mutateAsync({ body: newAddress });
    } catch (error) {
      console.log(JSON.stringify(error, null, 4));
    }
  }

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
      <View style={styles.markerFixed}>
        <Image
          source={require("../../assets/images/location-marker.png")}
          style={styles.marker}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: 1000,
          width: "95%",
        }}
      >
        <View className="border border-gray-200 rounded-lg p-1 mb-2 bg-white w-full">
          <Textarea
            value={adrress}
            onChangeText={(text) => {
              setAdrressError(false);
              setAdrress(text);
            }}
            className={
              adrressError
                ? "text-base w-full border border-red-500"
                : "text-base w-full"
            }
            placeholder="Dirección"
          />
        </View>
        <View className="border border-gray-200 rounded-lg p-1 mb-2 bg-white">
          <TextInput
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
            }}
            className="text-base w-full"
            placeholder="Apodo (opcional)"
          />
        </View>
        <Button
          className="w-full bg-[#FFD100] rounded-full py-6 mb-6"
          onPress={handleSubmit}
        >
          {addAddress.isPending ? (
            <Loader />
          ) : (
            <Text className="text-black text-base font-medium">
              Guardar Cambios
            </Text>
          )}
        </Button>
      </View>
      <MapView
        initialRegion={region}
        style={styles.map}
        onRegionChange={(newRegion) => {
          console.log("Region changed:", newRegion);
          setMarkerPosition({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
          });
        }}
      ></MapView>
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
  markerFixed: {
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 48,
    width: 48,
    zIndex: 1000,
  },
});
