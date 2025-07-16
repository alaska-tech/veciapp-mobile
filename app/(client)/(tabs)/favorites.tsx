import { ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Stack } from "expo-router";
import React from "react";
import FavoriteCard from "~/components/epic/favoriteCard";
import { useFavoriteStore } from "~/store/favoriteStore";

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
        {favorites.map((item) => (
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
        ))}
      </ScrollView>
    </>
  );
}
