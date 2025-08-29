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
          headerBackVisible: true,
          headerTitle: "Todos los Veci-negocios",
        }}
      />
      <Stack.Screen
        name="chats"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Chats",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="customerCategories"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Categorías",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="customerSettings"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Configuración",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen name="loadingScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="newLocation"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Nueva Ubicación",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="orderDetailsScreen"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del Pedido",
          headerBackVisible: true,
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
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="showLocation"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Ubicación",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del producto",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="branch/[id]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Detalles del veci-proveedor",
          headerBackVisible: true,
        }}
      />{" "}
      <Stack.Screen
        name="myOrdersScreen/[status]"
        options={{
          headerShown: true,
          headerBackTitle: "Volver",
          headerTitle: "Mis Pedidos",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
