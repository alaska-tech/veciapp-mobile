import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PackageOpen, TrendingUp, MessageSquareMore } from "lucide-react-native";
import HeaderVendor from "~/components/epic/headerVendor";
import { Separator } from "~/components/ui/separator";

export default function VendorHome() {
  const stats = {
    orders: 12,
    earnings: 250000,
    messages: 5
  };

  return (
    <ScrollView className="h-full w-full pt-4 mt-12 bg-emerald-700">
        <HeaderVendor />
        <Separator />
       <Text className="text-2xl font-bold text-white">Pedidos Activos</Text>
      <View className="flex-row gap-4 mb-6">
        <Card className="flex-1 bg-green-100">
          <CardContent className="p-4">
            <PackageOpen className="h-8 w-8 mb-2" color="#16a34a" />
            <Text className="text-2xl font-bold">{stats.orders}</Text>
            <Text className="text-muted-foreground">New Orders</Text>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-blue-100">
          <CardContent className="p-4">
            <TrendingUp className="h-8 w-8 mb-2" color="#2563eb" />
            <Text className="text-2xl font-bold">${stats.earnings.toLocaleString()}</Text>
            <Text className="text-muted-foreground">Earnings</Text>
          </CardContent>
        </Card>
      </View>

      <Card className="mb-6 bg-pink-100">
        <CardContent className="p-4">
          <MessageSquareMore className="h-8 w-8 mb-2" color="#db2777" />
          <Text className="text-2xl font-bold">{stats.messages}</Text>
          <Text className="text-muted-foreground">Unread Messages</Text>
        </CardContent>
      </Card>

      <View className="gap-4">
        <Button 
          className="w-full bg-primary" 
          size="lg"
        >
          <Text className="text-white text-lg">View Active Orders</Text>
        </Button>
        
        <Button 
          className="w-full" 
          variant="outline"
          size="lg"
        >
          <Text className="text-lg">Manage Products</Text>
        </Button>
      </View>
    </ScrollView>
  );
}