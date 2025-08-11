import { Stack } from "expo-router";
import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import { useCartStore } from "~/store/cartStore";
import { useFavoriteStore } from "~/store/favoriteStore";

export default function ClientLayout() {
  const { user } = useAuth();

  const { initCart } = useCartStore();
  const { initFavorites } = useFavoriteStore();
  useEffect(() => {
    if (!user?.foreignPersonId) {
      return;
    }
   // initCart(user?.foreignPersonId);
    initFavorites(user?.foreignPersonId);
  }, [user?.foreignPersonId]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del producto",
        }}
      />
    </Stack>
  );
}
