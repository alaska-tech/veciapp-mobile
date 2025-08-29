import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShadowVisible: false,
          headerTitle: "Mi Cuenta",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="aboutUsScreen"
        options={{
          title: "Acerca de Nosotros",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Volver",
        }}
      />
      <Stack.Screen
        name="faqScreen"
        options={{
          title: "Preguntas Frecuentes",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Volver",
        }}
      />
      <Stack.Screen
        name="locationSettings"
        options={{
          title: "Configuración de Ubicación",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Volver",
        }}
      />
      <Stack.Screen
        name="newLocation"
        options={{
          title: "Nueva dirección",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Volver",
        }}
      />
      <Stack.Screen
        name="orderHistoryScreen"
        options={{
          title: "Historial de Pedidos",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Volver",
        }}
      />
      <Stack.Screen
        name="securitySettings"
        options={{
          title: "Configuración de Seguridad",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitle: "Volver",
        }}
      />
    </Stack>
  );
}
