import { Stack } from "expo-router";
const routes: Record<string, string> = {
  "product/[id]": "Detalles del producto",
  "branch/[id]": "Detalles del veci-proveedor",
  "myOrdersScreen/[status]": "Mis Pedidos",
  allVendorsScreen: "Todos los Veci-negocios",
  chats: "Chats",
  customerCategories: "Categorías",
  customerSettings: "Configuración",
  newLocation: "Nueva Ubicación",
  orderDetailsScreen: "Detalles del Pedido",
  paymentResultScreen: "Resultado de pago",
  searchResultsScreen: "Resultados de Búsqueda",
  showLocation: "Ubicación",
};
export default function CustomerScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loadingScreen" options={{ headerShown: false }} />
      {Object.entries(routes).map(([key, value]) => {
        return (
          <Stack.Screen
            key={key}
            name={key}
            options={{
              title: value,
              headerShown: true,
              headerTitleAlign: "center",
              headerBackTitle: "Volver",
              headerTitle: value,
              headerBackVisible: true,
              headerShadowVisible: false,
            }}
          />
        );
      })}
    </Stack>
  );
}
