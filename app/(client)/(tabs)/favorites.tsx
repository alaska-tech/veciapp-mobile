import { RefreshControl, ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Stack } from "expo-router";
import React from "react";
import FavoriteCard from "~/components/epic/favoriteCard";
import { useFavoriteStore } from "~/store/favoriteStore";
import { Button } from "~/components/ui/button";
import { useBranchAction } from "~/actions/branch.action";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, removeFavorite, loading, refresh } = useFavoriteStore();
  const branchActions = useBranchAction();
  const BranchesQuery = branchActions.getBranchesById(
    favorites.map((e) => e.productService?.branchId)
  );
  function handleRefresh() {
    refresh();
  }
  return (
      <ScrollView
        className="h-full w-full p-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {favorites.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-xl text-gray-500 mb-6">
              No tienes favoritos aún
            </Text>
            <Button
              className="bg-yellow-400 rounded-full px-8"
              onPress={() => router.push("/home")}
            >
              <Text className="text-black font-bold">Explorar productos</Text>
            </Button>
          </View>
        ) : (
          favorites.map((item) => (
            <FavoriteCard
              key={item.id}
              name={item.productService?.name}
              price={Number.parseFloat(item.productService?.price)}
              image={item.productService?.logo || ""}
              discount={Number.parseFloat(item.productService?.discount)}
              veciproveedor={
                BranchesQuery.find(
                  (query) => query.data?.id === item?.productService?.branchId
                )?.data?.name || "Desconocido"
              }
              onDelete={() => removeFavorite(item.productServiceId)}
              onWantIt={() => {
                // Handle "Lo quiero" action
                console.log("Want to buy:", item.productService?.name);
              }}
            />
          ))
        )}
      </ScrollView>
  );
}
