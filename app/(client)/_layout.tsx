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
          headerTitle: "Detalles del producto",
          presentation: "modal"
        }}
      />
    </Stack>
  );
}