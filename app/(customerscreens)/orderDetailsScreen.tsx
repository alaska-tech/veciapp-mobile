import React from "react";
import { View, ScrollView, SafeAreaView, Image } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { 
  Star, 
  User, 
  Calendar, 
  MapPin, 
  CheckCircle 
} from "lucide-react-native";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Sample data - replace with actual data from your API/state management
  const orderDetails = {
    orderNumber: "123456789",
    productName: "Arepas Rellenas de Carne y Queso",
    productImage: "https://picsum.photos/207",
    rating: 4,
    vendorName: "Erica Madeleine Soto",
    date: "Nov 15, 2025 10:34 AM",
    address: "123 Main St, Anytown",
    status: "Completo",
    unitPrice: 20000,
    quantity: 1,
    subtotal: 20000,
    maleuaFee: 2000,
    shippingCost: 0,
    totalPaid: 22000,
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? "#fbbf24" : "transparent"}
        color="#fbbf24"
        className="mr-1"
      />
    ));
  };

  const handleRepeatOrder = () => {
    console.log("Repeating order:", orderId);
    // Implement your repeat order logic here
    // router.push("/cart");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Detalles de la orden",
          headerTitleAlign: "center",
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
          {/* Order Summary Card */}
          <Card className="mt-6 mb-6 rounded-3xl bg-white border-0 shadow">
            <CardContent className="p-6">
              {/* Order Number */}
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                Orden #{orderDetails.orderNumber}
              </Text>

              {/* Product Overview */}
              <View className="flex-row items-start mb-6">
                <Image
                  source={{ uri: orderDetails.productImage }}
                  className="w-20 h-20 rounded-xl mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-2">
                    {orderDetails.productName}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-600 mr-2">Calificación:</Text>
                    <View className="flex-row">
                      {renderStars(orderDetails.rating)}
                    </View>
                  </View>
                </View>
              </View>

              {/* Customer and Delivery Details */}
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <User size={16} color="#6b7280" className="mr-3" />
                    <Text className="text-sm text-gray-600">Veci</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    {orderDetails.vendorName}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Calendar size={16} color="#6b7280" className="mr-3" />
                    <Text className="text-sm text-gray-600">Fecha</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    {orderDetails.date}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <MapPin size={16} color="#6b7280" className="mr-3" />
                    <Text className="text-sm text-gray-600">Dirección</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    {orderDetails.address}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <CheckCircle size={16} color="#6b7280" className="mr-3" />
                    <Text className="text-sm text-gray-600">Entregado</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    {orderDetails.status}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Items Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Items (1)
            </Text>
            
            <View className="flex-row items-start bg-gray-50 p-4 rounded-2xl">
              <Image
                source={{ uri: orderDetails.productImage }}
                className="w-16 h-16 rounded-xl mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  {orderDetails.productName}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Valor unitario: {formatPrice(orderDetails.unitPrice)}
                </Text>
                <Text className="text-sm text-gray-600">
                  Unidades: {orderDetails.quantity}
                </Text>
              </View>
            </View>
          </View>

          {/* Cost Breakdown */}
          <View className="mb-8">
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Subtotal</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {formatPrice(orderDetails.subtotal)}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Maleua Fee</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {formatPrice(orderDetails.maleuaFee)}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Costo envío</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {orderDetails.shippingCost === 0 ? "Gratis" : formatPrice(orderDetails.shippingCost)}
                </Text>
              </View>
              
              <Separator className="my-2" />
              
              <View className="flex-row justify-between">
                <Text className="text-base font-bold text-gray-900">Total pagado</Text>
                <Text className="text-base font-bold text-gray-900">
                  {formatPrice(orderDetails.totalPaid)}
                </Text>
              </View>
            </View>
          </View>

          {/* Repeat Order Button */}
          <Button
            size="lg"
            className="w-full rounded-full bg-yellow-400"
            onPress={handleRepeatOrder}
          >
            <Text className="text-black font-bold">Repetir Orden</Text>
          </Button>
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 