import React from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import OrderHistoryCard from "~/components/epic/orderHistoryCard";

export default function OrderHistoryScreen() {
  const router = useRouter();

  // Sample data - replace with actual data from your API/state management
  const todayOrders = [
    {
      id: 1,
      productName: "Arepas Rellenas de Carne y Queso",
      productImage: "https://picsum.photos/207",
      vendorName: "Erica Madeleine Soto",
      total: 20000,
    },
  ];

  const yesterdayOrders = [
    {
      id: 2,
      productName: "Sopa de pollo",
      productImage: "https://picsum.photos/208",
      vendorName: "Marcos Solis",
      total: 20000,
    },
    {
      id: 3,
      productName: "Camiseta de la selección",
      productImage: "https://picsum.photos/209",
      vendorName: "Juan Pablo",
      total: 20000,
    },
  ];

  const handleViewDetails = (orderId: number) => {
    // Navigate to order details screen
    router.push(`/(customerscreens)/orderDetailsScreen?orderId=${orderId}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Historial",
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: "Volver",
        }}
      />
      
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView 
          className="flex-1 px-4" 
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
            <Separator className="mt-4" />
          {/* Today Section */}
          {todayOrders.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Hoy
              </Text>
              {todayOrders.map((order) => (
                <OrderHistoryCard
                  key={order.id}
                  productName={order.productName}
                  productImage={order.productImage}
                  vendorName={order.vendorName}
                  total={order.total}
                  onViewDetails={() => handleViewDetails(order.id)}
                />
              ))}
            </View>
          )}

          {/* Yesterday Section */}
          {yesterdayOrders.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Ayer
              </Text>
              {yesterdayOrders.map((order) => (
                <OrderHistoryCard
                  key={order.id}
                  productName={order.productName}
                  productImage={order.productImage}
                  vendorName={order.vendorName}
                  total={order.total}
                  onViewDetails={() => handleViewDetails(order.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 