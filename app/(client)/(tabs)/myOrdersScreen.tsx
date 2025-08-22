import React from "react";
import { View, ScrollView, Text } from "react-native";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import OrderDetailCard from "~/components/epic/orderDetailCard";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import { useOrderActions } from "~/actions/order.action";
import { useProductAction } from "~/actions/product.action";
import dayjs from "dayjs";

export default function MyOrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const orderAction = useOrderActions();
  const ordersQuery = orderAction.getOrdersByCustomerId(user?.foreignPersonId);
  const productAction = useProductAction();
  /*   const products = productAction.getProductsById(ordersQuery.data?.data.map(e=>e.)) */
  // Datos de ejemplo del pedido activo
  const activeOrder = {
    date: "12/03/2025",
    productName: "Hamburguesa de pollo con queso",
    productImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center",
    price: 20000,
    discount: 20,
    status: "Preparando el pedido",
    timeline: [
      {
        status: "Pago recibido",
        time: "8:38 am",
      },
      {
        status: "Preparando el pedido",
        time: "8:45 am",
      },
      {
        status: "Listo para entregar/recoger",
        time: "9:15 am",
      },
      {
        status: "Entregado",
        time: "9:25 am",
      },
    ],
  };

  const handleCoordinateDelivery = () => {
    // Navegar a la vista de chats
    router.push("/(customerscreens)/chats");
    console.log("Navegando a chats...");
  };

  const handleCancelOrder = () => {
    // Aquí puedes implementar la lógica para cancelar el pedido
    console.log("Cancelando pedido...");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Content */}
      <Text>{JSON.stringify(ordersQuery.data)}</Text>
      <ScrollView className="flex-1 px-4 py-6">
        {ordersQuery.data?.data.map((order) => {
          return (
            <OrderDetailCard
              date={dayjs(order.createdAt).format("dd/MM/YYYY")}
              onCoordinateDelivery={handleCoordinateDelivery}
              onCancelOrder={handleCancelOrder}
              status={order.status || ""}
              timeline={order.timeline as any[]}
              products={order.products.map((e) => {
                return {
                  productName: "",
                  productImage: "",
                  price: 0,
                  discount: 0,
                };
              })}
            />
          );
        })}
        {/* <OrderDetailCard
          date={activeOrder.date}
          productName={activeOrder.productName}
          productImage={activeOrder.productImage}
          price={activeOrder.price}
          discount={activeOrder.discount}
          status={activeOrder.status}
          timeline={activeOrder.timeline}
          onCoordinateDelivery={handleCoordinateDelivery}
          onCancelOrder={handleCancelOrder}
        /> */}
      </ScrollView>
    </View>
  );
}
