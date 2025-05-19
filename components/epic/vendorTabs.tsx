import React, { useState } from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Clock, ListChecks, History } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import VendorActiveCard from "./vendorActiveCard";
import VendorPendingCard from "./vendorPendingCard";
import VendorHistoryCard from "./vendorHistoryCard";

// Define types for our order data
interface Order {
  id: string;
  date: string;
  productName: string;
  price: number;
  lastUpdate: string;
  clientName?: string;
  clientAddress?: string;
  clientImage?: string;
  products?: string[];
  isNewOrder?: boolean;
  timeline?: Array<{ status: string; time: string }>;
}

export default function VendorTabs() {
  const { tab } = useLocalSearchParams<{ tab: string }>();
  const activeTab = tab || "activos";

  // State for orders in each category
  const [pendingOrders, setPendingOrders] = useState<Order[]>([
    {
      id: "p1",
      date: "12 de Marzo",
      productName: "Picada Samaria",
      price: 35000,
      clientName: "EdgarPerez",
      clientAddress: "Calle 123 St 45 # 65 - Gaira",
      clientImage: "https://picsum.photos/201",
      isNewOrder: true,
      lastUpdate: "12 min",
    },
    {
      id: "p2",
      date: "12 de Marzo",
      productName: "Hamburguesa Especial",
      price: 28000,
      clientName: "CarlosRodriguez",
      clientAddress: "Av Principal #45-12",
      clientImage: "https://picsum.photos/202",
      isNewOrder: true,
      lastUpdate: "15 min",
    },
    {
      id: "p3",
      date: "12 de Marzo",
      productName: "Pizza Familiar",
      price: 42000,
      clientName: "MariaGarcia",
      clientAddress: "Calle 78 #23-45",
      clientImage: "https://picsum.photos/203",
      isNewOrder: true,
      lastUpdate: "18 min",
    },
  ]);

  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: "a1",
      date: "12 de Marzo",
      productName: "Arepas Rellenas de Carne y Queso",
      price: 20000,
      lastUpdate: "12 minutos",
    },
    {
      id: "a2",
      date: "12 de Marzo",
      productName: "Empanadas de Carne (x5)",
      price: 15000,
      lastUpdate: "15 minutos",
    },
    {
      id: "a3",
      date: "12 de Marzo",
      productName: "Tequeños (x8)",
      price: 18000,
      lastUpdate: "20 minutos",
    },
  ]);

  const [historyOrders, setHistoryOrders] = useState<Order[]>([
    {
      id: "h1",
      date: "11 de Marzo",
      productName: "",
      price: 20000,
      products: ["Arepas Rellenas de Carne y Queso", "Jugo de Mango"],
      clientName: "Luis B",
      clientAddress: "Calle 10 # 50 - Santa Marta",
      clientImage: "https://picsum.photos/203",
      lastUpdate: "",
      timeline: [
        { status: "Pago recibido", time: "8:38 am" },
        { status: "Preparando el pedido", time: "8:45 am" },
        { status: "Listo para entregar/recoger", time: "9:15 am" },
        { status: "Entregado", time: "9:25 am" },
      ],
    },
    {
      id: "h2",
      date: "11 de Marzo",
      productName: "",
      price: 35000,
      products: ["Pizza Familiar Hawaiana"],
      clientName: "Maria G",
      clientAddress: "Calle 15 # 45 - Santa Marta",
      clientImage: "https://picsum.photos/202",
      lastUpdate: "",
      timeline: [
        { status: "Pago recibido", time: "2:30 pm" },
        { status: "Preparando el pedido", time: "2:35 pm" },
        { status: "Listo para entregar/recoger", time: "3:00 pm" },
        { status: "Entregado", time: "3:15 pm" },
      ],
    },
    {
      id: "h3",
      date: "11 de Marzo",
      productName: "",
      price: 25000,
      products: ["Hamburguesa Especial", "Papas Fritas"],
      clientName: "Carlos R",
      clientAddress: "Calle 20 # 30 - Santa Marta",
      clientImage: "https://picsum.photos/200",
      lastUpdate: "",
      timeline: [
        { status: "Pago recibido", time: "7:00 pm" },
        { status: "Preparando el pedido", time: "7:05 pm" },
        { status: "Listo para entregar/recoger", time: "7:25 pm" },
        { status: "Entregado", time: "7:40 pm" },
      ],
    },
  ]);

  // Function to move an order from pending to active
  const handleAttendOrder = (orderId: string) => {
    const orderToMove = pendingOrders.find(order => order.id === orderId);
    if (orderToMove) {
      // Remove from pending orders
      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      
      // Add to active orders
      setActiveOrders([...activeOrders, {
        id: orderToMove.id,
        date: orderToMove.date,
        productName: orderToMove.productName,
        price: orderToMove.price,
        lastUpdate: orderToMove.lastUpdate,
      }]);
      
      // Switch to active tab
      router.push('/orders?tab=activos');
    }
  };

  // Function to move an order from active to history
  const handleMarkAsReady = (orderId: string) => {
    const orderToMove = activeOrders.find(order => order.id === orderId);
    if (orderToMove) {
      // Get current time
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      
      // Remove from active orders
      setActiveOrders(activeOrders.filter(order => order.id !== orderId));
      
      // Add to history orders with timeline
      setHistoryOrders([{
        id: orderToMove.id,
        date: orderToMove.date,
        productName: "",
        products: [orderToMove.productName],
        price: orderToMove.price,
        clientName: "Cliente",
        clientAddress: "Dirección del cliente",
        clientImage: "https://picsum.photos/200",
        lastUpdate: "",
        timeline: [
          { status: "Pago recibido", time: "Anterior" },
          { status: "Preparando el pedido", time: "Anterior" },
          { status: "Listo para entregar/recoger", time: formattedTime },
        ],
      }, ...historyOrders]);
      
      // Switch to history tab
      router.push('/orders?tab=historial');
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        router.push(`/orders?tab=${value}`);
      }}
      className="w-full"
    >
      <TabsList className="w-full mb-4 flex-row">
        <TabsTrigger value="activos" className="flex-1 rounded-md px-2">
          <View className="flex-row items-center justify-center gap-1">
            <ListChecks size={18} />
            <Text>Activos</Text>
            <View className="bg-blue-500 rounded-full px-2">
              <Text className="text-white text-xs">{activeOrders.length}</Text>
            </View>
          </View>
        </TabsTrigger>
        <TabsTrigger value="pendientes" className="flex-1 rounded-md px-2">
          <View className="flex-row items-center justify-center gap-1">
            <Clock size={18} />
            <Text>Pendientes</Text>
            <View className="bg-orange-500 rounded-full px-2">
              <Text className="text-white text-xs">{pendingOrders.length}</Text>
            </View>
          </View>
        </TabsTrigger>
        <TabsTrigger value="historial" className="flex-1 rounded-md px-2">
          <View className="flex-row items-center justify-center gap-1">
            <History size={18} />
            <Text>Historial</Text>
          </View>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="activos" className="px-4">
        {activeOrders.map((order) => (
          <VendorActiveCard
            key={order.id}
            date={order.date}
            productName={order.productName}
            price={order.price}
            lastUpdate={order.lastUpdate}
            onChat={() => console.log("Chat pressed")}
            onMarkAsReady={() => handleMarkAsReady(order.id)}
          />
        ))}
      </TabsContent>

      <TabsContent value="pendientes" className="px-4">
        {pendingOrders.map((order) => (
          <VendorPendingCard
            key={order.id}
            date={order.date}
            productName={order.productName}
            price={order.price}
            clientName={order.clientName || ""}
            clientAddress={order.clientAddress || ""}
            clientImage={order.clientImage || ""}
            isNewOrder={order.isNewOrder}
            lastUpdate={order.lastUpdate}
            onChat={() => console.log("Chat pressed")}
            onAttendOrder={() => handleAttendOrder(order.id)}
          />
        ))}
      </TabsContent>

      <TabsContent value="historial" className="px-4">
        {historyOrders.map((order) => (
          <VendorHistoryCard
            key={order.id}
            date={order.date}
            products={order.products || [order.productName]}
            price={order.price}
            clientName={order.clientName || ""}
            clientAddress={order.clientAddress || ""}
            clientImage={order.clientImage || ""}
            status="Entregado"
            timeline={order.timeline || []}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}
