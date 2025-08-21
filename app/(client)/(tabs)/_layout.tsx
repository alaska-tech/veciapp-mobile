import { Redirect, Stack, Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "~/lib/authContext";
import { Home, ShoppingCart, Heart, User } from "lucide-react-native";
import { StackActions } from "@react-navigation/native";

export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function TabLayout() {
/*   const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn || authState.user?.role !== "customer") {
    return <Redirect href="/" />;
  } */
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f90909",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
        tabBarStyle: {
          paddingTop: 4,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
