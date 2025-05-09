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
    // Navigate or handle active orders
  };
  const handleEarnings = () => {
    // Navigate or handle earnings
  };
  const handleOrderHistory = () => {
    router.push("/orders");
  };
  const handleDashboard = () => {
    Linking.openURL("https://www.adminveciapp.com.co/"); //TODO: julian agrega el token eche :v
  };
  const handleMessages = () => {
    router.push("/chats");
  };

  return (
    <ScrollView className="h-full w-full pt-4 mt-12">
      <HeaderVendor />
      <Separator />
      <View className="px-4 pb-4">
        <Text className="text-3xl font-bold text-black py-4">
          Pedidos del día
        </Text>
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity style={{ flex: 1, aspectRatio: 1 }} onPress={handleActiveOrders}>
            <Card className="flex-1 justify-center bg-green-200">
              <CardContent className="flex-1 flex-row items-center justify-center">
                <View className="mr-4">
                  <Package size={44} color="#16a34a" />
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground font-semibold mb-1 text-lg">
                    Pendientes
                  </Text>
                  <Text className="text-4xl font-bold">{stats.orders}</Text>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, aspectRatio: 1 }} onPress={handleEarnings}>
            <Card className="flex-1 justify-center bg-blue-200">
              <CardContent className="flex-1 flex-row items-center justify-center">
                <View className="mr-4">
                  <PackageOpen size={44} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground font-semibold mb-1 text-lg">
                    Activos
                  </Text>
                  <Text className="text-4xl font-bold">{stats.history}</Text>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity style={{ flex: 1, aspectRatio: 1 }} onPress={handleOrderHistory}>
            <Card className="flex-1 justify-center bg-yellow-200">
              <CardContent className="flex-1 flex-row items-center justify-center">
                <View className="mr-4">
                  <History size={44} color="#ca8a04" />
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground font-semibold mb-1 text-lg">
                    Historial
                  </Text>
                  <Text className="text-4xl font-bold">{stats.history}</Text>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, aspectRatio: 1 }} onPress={handleMessages}>
            <Card className="flex-1 justify-center bg-purple-200">
              <CardContent className="flex-1 flex-row items-center justify-center">
                <View className="mr-4">
                  <MessageSquareMore size={44} color="#a21caf" />
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-muted-foreground font-semibold text-lg">
                    Mensajes
                  </Text>
                  <Text className="text-muted-foreground font-semibold mb-1 text-lg">
                    no leidos
                  </Text>
                  <Text className="text-4xl font-bold">{stats.messages}</Text>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>
      </View>

      <Separator />

      <View className="px-4 pb-4 pt-8">
        <TouchableOpacity onPress={handleDashboard}>
          <Card className="mb-6 bg-pink-100">
            <CardContent className="p-4 flex-row items-center">
              <View className="mr-4">
                <LayoutDashboard size={40} color="#db2777" />
              </View>
              <View className="flex-1">
                <Text className="text-muted-foreground text-lg font-medium">
                  Administración
                </Text>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity>
          <Card className="mb-6 bg-red-100">
            <CardContent className="p-4 flex-row items-center">
              <View className="mr-4">
                <CircleDollarSign size={40} color="#fd3500" />
              </View>
              <View className="flex-1">
                <Text className="text-muted-foreground text-lg font-medium mb-1">
                  Ventas del día
                </Text>
                <Text className="text-xl font-bold">
                  ${stats.earnings.toLocaleString()} ({stats.sales} ventas)
                </Text>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
        {/* 
         <View className="gap-4">
           <Button 
             className="w-full bg-primary" 
             size="lg"
           >
             <Text className="text-white text-lg">Ver pedidos activos</Text>
           </Button>
           
           <Button 
             className="w-full" 
             variant="outline"
             size="lg"
           >
             <Text className="text-lg">Gestionar productos</Text>
           </Button>
         </View>*/}
      </View>
    </ScrollView>
  );
}
