import React from "react";
import { View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import OrderDetailCard from "~/components/epic/orderDetailCard";

export default function MyOrdersScreen() {
  // Datos de ejemplo del pedido activo
  const activeOrder = {
    date: "12/03/2025",
    productName: "Hamburguesa de pollo con queso",
    productImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center",
    price: 20000,
    discount: 20,
    status: "Preparando el pedido",
    timeline: [
      {
        status: "Pago recibido",
        time: "8:38 am"
      },
      {
        status: "Preparando el pedido",
        time: "8:45 am"
      },
      {
        status: "Listo para entregar/recoger",
        time: "9:15 am"
      },
      {
        status: "Entregado",
        time: "9:25 am"
      }
    ]
  };

  const handleCoordinateDelivery = () => {
    // Aquí puedes implementar la lógica para coordinar la entrega
    console.log("Coordinando entrega...");
  };

  const handleCancelOrder = () => {
    // Aquí puedes implementar la lógica para cancelar el pedido
    console.log("Cancelando pedido...");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Mis Pedidos",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />
      
      <View className="flex-1 bg-white">
        {/* Content */}
        <ScrollView className="flex-1 px-4 py-6">
          <OrderDetailCard
            date={activeOrder.date}
            productName={activeOrder.productName}
            productImage={activeOrder.productImage}
            price={activeOrder.price}
            discount={activeOrder.discount}
            status={activeOrder.status}
            timeline={activeOrder.timeline}
            onCoordinateDelivery={handleCoordinateDelivery}
            onCancelOrder={handleCancelOrder}
          />
        </ScrollView>
      </View>
    </>
  );
} 