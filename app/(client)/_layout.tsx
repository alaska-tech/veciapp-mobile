import { Stack } from "expo-router";

export default function ClientLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del producto"
        }}
      />
    </Stack>
  );
}