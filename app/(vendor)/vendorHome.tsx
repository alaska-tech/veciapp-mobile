import { View, ScrollView, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import {
  PackageOpen,
  Package,
  CircleDollarSign,
  MessageSquareMore,
  History,
  LayoutDashboard,
} from "lucide-react-native";
import HeaderVendor from "~/components/epic/headerVendor";
import { Separator } from "~/components/ui/separator";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function VendorHome() {
  const stats = {
    orders: 12,
    history: 120,
    earnings: 250000,
    messages: 5,
    sales: 16,
  };

  // Example handlers for each card
  const handleActiveOrders = () => {
    router.push("/orders?tab=activos");
  };

  const handlePendingOrders = () => {
    router.push("/orders?tab=pendientes");
  };

  const handleOrderHistory = () => {
    router.push("/orders?tab=historial");
  };
  const handleDashboard = () => {
    router.push("/(aux)/dashboard");
  };
  const handleMessages = () => {
    router.push("/chats");
  };

  // Shadow style for cards
  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  };

  return (
    <ScrollView className="h-full w-full pt-4 mt-12">
      <HeaderVendor />
      <Separator />
      <View className="px-4 pb-4">
        <Text className="text-3xl font-bold text-black py-4">
          Indicadores del día
        </Text>
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity
            style={{ flex: 1, aspectRatio: 1, ...cardShadow }}
            onPress={handlePendingOrders}
          >
            <View className="flex-1 rounded-2xl bg-[#FFD100] border-2 border-[#bfa100]">
              <CardContent className="flex-1 flex-col justify-center px-4">
                <View className="flex-row items-center mb-2">
                  <Package size={28} color="#000" />
                  <Text className="ml-2 text-base font-medium text-black">
                    Pedidos
                  </Text>
                </View>
                <Text className="text-2xl font-semibold text-black mb-1">
                  Pendientes
                </Text>
                <Text className="text-5xl font-extrabold text-black">
                  {stats.orders}
                </Text>
              </CardContent>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, aspectRatio: 1, ...cardShadow }}
            onPress={handleActiveOrders}
          >
            <View className="flex-1 rounded-2xl bg-[#ffffff] border-2 border-[#7BA7FF]">
              <CardContent className="flex-1 flex-col justify-center px-4">
                <View className="flex-row items-center mb-2">
                  <PackageOpen size={28} color="#7BA7FF" />
                  <Text className="ml-2 text-base font-medium text-[#7BA7FF]">
                    Pedidos
                  </Text>
                </View>
                <Text className="text-2xl font-semibold text-[#7BA7FF] mb-1">
                  Activos
                </Text>
                <Text className="text-5xl font-extrabold text-[#7BA7FF]">
                  2
                </Text>
              </CardContent>
            </View>
          </TouchableOpacity>
        </View>

        <View className="gap-4 mb-6">
          <TouchableOpacity onPress={handleOrderHistory}>
            <View
              className="rounded-2xl bg-[#ffffff] border-2 border-[#7BA7FF]"
              style={cardShadow}
            >
              <CardContent className="px-4 py-2">
                <View className="flex-row items-center mb-1">
                  <History size={20} color="#7BA7FF" />
                  <Text className="ml-2 text-base font-medium text-[#7BA7FF]">
                    Historial
                  </Text>
                </View>
                <Text className="text-2xl font-semibold text-[#7BA7FF]">
                  Ventas
                </Text>
                <Text className="text-4xl font-bold text-[#7BA7FF]">
                  {stats.history}
                </Text>
              </CardContent>
            </View>
          </TouchableOpacity>
        </View>

        <View className="gap-4 mb-4">
          <TouchableOpacity onPress={handleMessages}>
            <View
              className="rounded-2xl bg-[#ffffff] border-2 border-[#7BA7FF]"
              style={cardShadow}
            >
              <CardContent className="px-4 py-2">
                <View className="flex-row items-center mb-1">
                  <MessageSquareMore size={20} color="#7BA7FF" />
                  <Text className="ml-2 text-base font-medium text-[#7BA7FF]">
                    Mensajes
                  </Text>
                </View>
                <Text className="text-2xl font-semibold text-[#7BA7FF]">
                  No leídos
                </Text>
                <Text className="text-4xl font-bold text-[#7BA7FF]">
                  {stats.messages}
                </Text>
              </CardContent>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pb-4">
        <TouchableOpacity onPress={handleDashboard}>
          <View
            className="rounded-2xl bg-[#FFD100] border-2 border-[#bfa100] mb-4"
            style={cardShadow}
          >
            <CardContent className="p-4 flex-row items-center">
              <LayoutDashboard size={28} color="#000" />
              <View className="ml-2 flex-1">
                <Text className="text-base font-medium text-black">
                  Administración
                </Text>
                <Text className="text-lg underline text-black">
                  Gestionar mi cuenta
                </Text>
              </View>
            </CardContent>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View
            className="rounded-2xl bg-[#35B675] border-2 border-[#218c4a] mb-4"
            style={cardShadow}
          >
            <CardContent className="p-4 flex-row items-center">
              <CircleDollarSign size={28} color="#000" />
              <View className="ml-2 flex-1">
                <Text className="text-base font-medium text-black">
                  Ventas del día
                </Text>
                <Text className="text-2xl font-bold text-black">
                  ${stats.earnings.toLocaleString()}{" "}
                  <Text className="text-base font-normal text-black">
                    ({stats.sales} ventas)
                  </Text>
                </Text>
              </View>
            </CardContent>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
