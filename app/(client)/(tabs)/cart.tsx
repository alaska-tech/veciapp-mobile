import { ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import CartCard from "~/components/epic/cartCard";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MapPinIcon } from "lucide-react-native";
import { useCartStore } from "~/store/cartStore";

export default function CartScreen() {
  const router = useRouter();
  
  // Usar el store de Zustand para gestionar el estado del carrito
  const { 
    cartItems, 
    salonItems, 
    updateCartItemQuantity, 
    removeCartItem,
    updateSalonItemQuantity,
    removeSalonItem
  } = useCartStore();

  // Calculate totals based on current cart items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.10; // 10% service charge
  const deliveryFee = 10000;
  const total = subtotal + serviceCharge + deliveryFee;

  // Calculate totals for salon items
  const salonSubtotal = salonItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const salonServiceCharge = salonSubtotal * 0.10; // 10% service charge
  const salonDeliveryFee = 8000;
  const salonTotal = salonSubtotal + salonServiceCharge + salonDeliveryFee;

  // Manejadores de eventos que ahora usan las acciones de Zustand
  const handleQuantityChange = (index: number, newQuantity: number) => {
    updateCartItemQuantity(index, newQuantity);
  };

  const handleDelete = (index: number) => {
    removeCartItem(index);
  };

  const handleSalonQuantityChange = (index: number, newQuantity: number) => {
    updateSalonItemQuantity(index, newQuantity);
  };

  const handleSalonDelete = (index: number) => {
    removeSalonItem(index);
  };

  return (
    <>
    <Stack.Screen
      options={{
        headerShadowVisible: false,
        headerTitle: "Carrito de compras",
        headerTitleAlign: "center",
        headerShown: true,
        headerBackVisible: true, 
      }}
    />
    <ScrollView className="h-full w-full p-4">
    <View className="flex-row items-center flex-1 ml-2 mb-4 pb-4 border-b border-gray-300">
          <MapPinIcon size={20} color="#ffffff" fill="#666"/>
          <Text 
            className="text-gray-500 text-md pr-1"
          >
            Enviar a
          </Text>
          <Text 
            className="text-black text-md font-bold flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Calle 123 St 45 # 65 Sta Marta, Calle256723467834...
          </Text>
        </View>
      {cartItems.length > 0 && (
        <CartCard
          providerName="Sabores de Santa Marta"
          providerImage="https://picsum.photos/200"
          distance="1.2Km"
          items={cartItems}
          subtotal={subtotal}
          serviceCharge={serviceCharge}
          deliveryFee={deliveryFee}
          total={total}
          onQuantityChange={handleQuantityChange}
          onDelete={handleDelete}
          onPayPress={() => {
            // Handle payment logic here :v
            console.log("Processing payment...");
          }}
        />
      )}
      
      {cartItems.length > 0 && salonItems.length > 0 && <View className="h-4" />}
      
      {salonItems.length > 0 && (
        <CartCard
          providerName="Estilo Caribe Salón"
          providerImage="https://picsum.photos/201"
          distance="0.8Km"
          items={salonItems}
          subtotal={salonSubtotal}
          serviceCharge={salonServiceCharge}
          deliveryFee={salonDeliveryFee}
          total={salonTotal}
          onQuantityChange={handleSalonQuantityChange}
          onDelete={handleSalonDelete}
          onPayPress={() => {
            console.log("Processing salon payment...");
          }}
        />
      )}
      
      {cartItems.length === 0 && salonItems.length === 0 && (
        <View className="items-center justify-center py-10">
          <Text className="text-xl text-gray-500 mb-6">Tu carrito está vacío</Text>
          <Button 
            className="bg-yellow-400 rounded-full px-8"
            onPress={() => router.push('/home')}
          >
            <Text className="text-black font-bold">Explorar productos</Text>
          </Button>
        </View>
      )}
    </ScrollView>
    </>
  );
}
