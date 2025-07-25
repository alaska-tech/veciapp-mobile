import React, { useEffect, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button } from "~/components/ui/button";
import useCustomerAction from "~/actions/customer.action";
import { Loader } from "~/components/ui/loader";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import { Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Trash2 } from "lucide-react-native";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const router = useRouter();
  const { location } = useLocalSearchParams();
  const parsedLocation = JSON.parse(location as string);
  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const getCustomerDetails = customerActions.getCustomerDetails(
    user?.foreignPersonId
  );
  const updateCustomer = customerActions.updateCustomer();
  useEffect(() => {
    async function setInitialLocation() {
      try {
        setRegion({
          latitude: parsedLocation.coordinates[0],
          longitude: parsedLocation.coordinates[1],
          latitudeDelta: 0.006991628812640371, // Más zoom que antes
          longitudeDelta: 0.0033819302916526794,
        });
      } catch (error) {
        setErrorMsg("Error getting location");
      } finally {
        setIsLoading(false);
      }
    }

    setInitialLocation();
  }, []);

  async function handleSubmit() {
    if (updateCustomer.isPending) {
      return;
    }
    if (parsedLocation.isFavorite) {
      Alert.alert("Error", "No se puede eliminar una dirección favorita.");
      return;
    }
    if (!getCustomerDetails.data) {
      Alert.alert(
        "Error",
        "No se pudo obtener los detalles del cliente. Por favor, inténtalo de nuevo más tarde."
      );
      return;
    }
    const { email, state, id, ...rest } = getCustomerDetails.data;
    const newCustomer = {
      ...rest,
      id: getCustomerDetails.data.id,
      locations: (getCustomerDetails.data.locations || [])?.toSpliced(
        parsedLocation.index,
        1
      ),
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
          headerTitle: "Dirección",
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
            bottom: 120,
            left: 10,
            zIndex: 1000,
            width: "95%",
          }}
        >
          <View className="flex-row items-center gap-4">
            <View className="bg-white border border-gray-200 rounded-lg p-2 mb-2 flex-1">
              <Text className="text-base">
                {parsedLocation.address || "Desconocido"}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500">Tipo: </Text>
                <Text>{parsedLocation.alias}</Text>
              </View>
            </View>
            <Button
              className="bg-[#FFD100] rounded-full mb-6"
              onPress={handleSubmit}
            >
              {updateCustomer.isPending ? <Loader /> : <Trash2 color="black" />}
            </Button>
          </View>
        </View>
        <MapView initialRegion={region} style={styles.map}>
          <Marker coordinate={region} />
        </MapView>
      </View>
    </>
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
