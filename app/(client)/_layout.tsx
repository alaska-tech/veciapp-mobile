import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import { useCartStore } from "~/store/cartStore";
import { useFavoriteStore } from "~/store/favoriteStore";
import { useParametersStore } from "~/store/parametersStore";

export default function ClientLayout() {
  const { user } = useAuth();

  const { initCart } = useCartStore();
  const { initFavorites } = useFavoriteStore();
  const { initParameters } = useParametersStore();
  useEffect(() => {
    if (!user?.foreignPersonId) {
      return;
    }
    initCart(user?.foreignPersonId);
    initFavorites(user?.foreignPersonId);
    initParameters()
  }, [user?.foreignPersonId]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(customerscreens)" options={{ headerShown: false }} />
    </Stack>
  );
}
