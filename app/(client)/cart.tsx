import { ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import CartCard from "~/components/epic/cartCard";
import { useState } from "react";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MapPinIcon } from "lucide-react-native";

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      name: "Arroz con Coco Tradicional (Porción)",
      price: 15000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
    {
      name: "Tostadas de Pescado Frito",
      price: 22000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
    {
      name: "Ensalada de Frutas",
      price: 18000,
      image: "https://picsum.photos/200",
      quantity: 1,
    },
  ]);

  // Calculate totals based on current cart items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.10; // 10% service charge
  const deliveryFee = 10000;
  const total = subtotal + serviceCharge + deliveryFee;

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index].quantity = newQuantity;
      return newItems;
    });
  };

  const handleDelete = (index: number) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
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
    </ScrollView>
    </>
  );
}
