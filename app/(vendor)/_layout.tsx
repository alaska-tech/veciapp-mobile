import { Redirect, Tabs } from "expo-router";
import {
  Home,
  PackageOpen,
  MessageSquareMore,
  User,
} from "lucide-react-native";
import { useContext } from "react";
import { AuthContext } from "~/lib/authContext";

export default function TabLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn|| authState.user?.role !== "vendor") {
    return <Redirect href="/" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f90909",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="vendorHome"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => <PackageOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <MessageSquareMore size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vendorProfile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
