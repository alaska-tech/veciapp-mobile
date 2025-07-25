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
import { AddressLocation, Customer } from "~/constants/models";
import { Loader } from "~/components/ui/loader";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [address, setAddress] = useState("");
  const [adrressError, setAdrressError] = useState(false);
  const [nickname, setNickname] = useState("Casa");
  const router = useRouter();
  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const getCustomerDetails = customerActions.getCustomerDetails(
    user?.foreignPersonId
  );
  const updateCustomer = customerActions.updateCustomer();
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
          latitudeDelta: 0.006991628812640371, // Más zoom que antes
          longitudeDelta: 0.0033819302916526794,
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
    if (updateCustomer.isPending) {
      return;
    }
    if (!address) {
      setAdrressError(true);
      return;
    }
    if (!getCustomerDetails.data) {
      Alert.alert(
        "Error",
        "No se pudo obtener los detalles del cliente. Por favor, inténtalo de nuevo más tarde."
      );
      return;
    }
    const newAddress: AddressLocation = {
      alias: nickname,
      address: address,
      coordinates: [markerPosition.latitude, markerPosition.longitude], // lat, lng
    };
    const { email, state, id, ...rest } = getCustomerDetails.data;
    const newCustomer = {
      id: getCustomerDetails.data.id,
      locations: [newAddress, ...(getCustomerDetails.data.locations || [])],
    };
    console.log("newCustomer submitted:", newCustomer);
    try {
      await updateCustomer
        .mutateAsync({
          body: newCustomer as any,
        })
        .then(
          () => {
            router.dismissTo("/(customerscreens)/locationSettings");
          },
          () => {}
        );
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
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Nueva dirección",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            bottom: 100,
            left: 10,
            zIndex: 1000,
            width: "95%",
          }}
        >
          <View className="border border-gray-200 rounded-lg p-1 mb-2 bg-white w-full">
            <Textarea
              value={address}
              onChangeText={(text) => {
                setAdrressError(false);
                setAddress(text);
              }}
              className={
                adrressError
                  ? "text-base w-full border border-red-500"
                  : "text-base w-full"
              }
              placeholder="Dirección"
            />
          </View>
          <View className="flex-row justify-between border border-gray-200 rounded-lg p-1 mb-2 bg-white w-full">
            {["Casa", "Trabajo", "Pareja"].map((option) => (
              <Button
                key={option}
                className={`flex-1 mx-1 py-4 rounded-lg ${
                  nickname === option
                    ? "bg-[#FFD100]"
                    : "bg-white border border-gray-300"
                }`}
                onPress={() => setNickname(option)}
                variant="ghost"
              >
                <Text
                  className={`text-base text-center ${
                    nickname === option
                      ? "text-black font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                </Text>
              </Button>
            ))}
          </View>
          <Button
            className="w-full bg-[#FFD100] rounded-full py-6 mb-6"
            onPress={handleSubmit}
          >
            {updateCustomer.isPending ? (
              <Loader />
            ) : (
              <Text className="text-black text-base font-medium">
                Guardar Cambios
              </Text>
            )}
          </Button>
        </View>
        <View>
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
          <View style={styles.markerFixed}>
            <Image
              source={require("../../assets/images/location-marker.png")}
              style={styles.marker}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
