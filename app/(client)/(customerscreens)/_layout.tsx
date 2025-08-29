import { Stack } from "expo-router";

export default function CustomerScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="allVendorsScreen"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Todos los Veci-negocios",
        }}
      />
      <Stack.Screen
        name="chats"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Chats",
        }}
      />
      <Stack.Screen
        name="customerCategories"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Categorías",
        }}
      />
      <Stack.Screen
        name="customerSettings"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Configuración",
        }}
      />
      <Stack.Screen name="loadingScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="myOrdersScreen"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Mis Pedidos",
        }}
      />
      <Stack.Screen
        name="newLocation"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Nueva Ubicación",
        }}
      />
      <Stack.Screen
        name="orderDetailsScreen"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del Pedido",
        }}
      />
      <Stack.Screen
        name="paymentResultScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="searchResultsScreen"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Resultados de Búsqueda",
        }}
      />
      <Stack.Screen
        name="showLocation"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Ubicación",
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del producto",
        }}
      />
      <Stack.Screen
        name="branch/[id]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del veci-proveedor",
        }}
      />
    </Stack>
  );
}
