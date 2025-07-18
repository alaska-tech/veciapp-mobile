import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Stack } from "expo-router";
import React from "react";
import FavoriteCard from "~/components/epic/favoriteCard";
import { useFavoriteStore } from "~/store/favoriteStore";
import { Button } from "~/components/ui/button";

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = useFavoriteStore((state) => state.favorites);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Mis favoritos",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackVisible: true, 
        }}
      />
      <ScrollView className="h-full w-full p-4">
        {favorites.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-xl text-gray-500 mb-6">No tienes favoritos aún</Text>
            <Button 
              className="bg-yellow-400 rounded-full px-8"
              onPress={() => router.push('/home')}
            >
              <Text className="text-black font-bold">Explorar productos</Text>
            </Button>
          </View>
        ) : (
          favorites.map((item) => (
            <FavoriteCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              discount={item.discount}
              veciproveedor={item.veciproveedor}
              onDelete={() => removeFavorite(item.id)}
              onWantIt={() => {
                // Handle "Lo quiero" action
                console.log('Want to buy:', item.name);
              }}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}
