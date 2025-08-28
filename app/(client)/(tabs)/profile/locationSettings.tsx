import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Plus, Star } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import useCustomerAction from "~/actions/customer.action";
import { Loader } from "~/components/ui/loader";

export default function CustomerSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const customer = customerActions.getCustomerDetails(user?.foreignPersonId);
  const { locations = [], address = "{}", id } = customer.data ?? {};
  const parsedAddress = JSON.parse(address);
  const agregarNuevaDireccion = () => {
    router.push("/(client)/(customerscreens)/newLocation");
  };
  const updateCustomer = customerActions.updateCustomer();
  const handleFavoritePress = async ({
    item,
    isFavorite,
  }: {
    item: any;
    isFavorite: boolean;
  }) => {
    if (isFavorite) return;
    await updateCustomer.mutateAsync({
      body: { id, address: JSON.stringify(item) },
    });
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Direcciones",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />

      <ScrollView className="h-full w-full bg-white p-4 mb-16">
        <View className="mb-4">
          <ScrollView className="gap-4 mb-24">
            {locations.map((item, index) => {
              const isThisFavorite: boolean =
                parsedAddress.coordinates &&
                Array.isArray(parsedAddress.coordinates) &&
                item.coordinates &&
                Array.isArray(item.coordinates) &&
                parsedAddress.coordinates[0] === item.coordinates[0] &&
                parsedAddress.coordinates[1] === item.coordinates[1] &&
                item.address === parsedAddress.address &&
                item.alias === parsedAddress.alias;
              return (
                <View key={index}>
                  <Text className="text-base font-medium mb-2">
                    Dirección {index + 1}
                  </Text>
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      className="border border-gray-200 rounded-lg p-2 mb-2 flex-1"
                      onPress={() => {
                        router.push(
                          `/(customerscreens)/showLocation?location=${JSON.stringify(
                            { ...item, index, isFavorite: isThisFavorite }
                          )}`
                        );
                      }}
                    >
                      <Text className="text-base">
                        {item.address || "Desconocido"}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-gray-500">Tipo: </Text>
                        <Text>{item.alias}</Text>
                      </View>
                    </TouchableOpacity>
                    <Button
                      style={{ backgroundColor: "transparent" }}
                      disabled={isThisFavorite}
                      onPress={() => {
                        handleFavoritePress({
                          item,
                          isFavorite: isThisFavorite,
                        });
                      }}
                    >
                      {updateCustomer.isPending ? (
                        <Loader></Loader>
                      ) : (
                        <Star
                          className="h-5 w-5 mr-5"
                          color={isThisFavorite ? "#13c940ff" : "#d8d8d8ff"}
                        />
                      )}
                    </Button>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              className="border border-gray-200 rounded-full p-4 flex-row items-center justify-center mb-1"
              onPress={agregarNuevaDireccion}
            >
              <Plus size={20} color="#000" />
              <Text className="ml-2 text-base">Agregar Nueva Ubicación</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}
