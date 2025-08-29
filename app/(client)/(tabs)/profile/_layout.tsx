import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

const routes: Record<string, string> = {
  index: "Mi Cuenta",
  aboutUsScreen: "Acerca de Nosotros",
  faqScreen: "Preguntas Frecuentes",
  locationSettings: "Configuración de Ubicación",
  newLocation: "Nueva dirección",
  orderHistoryScreen: "Historial de Pedidos",
  securitySettings: "Configuración de Seguridad",
};

export default function ProfileLayout() {
  return (
    <Stack>
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
