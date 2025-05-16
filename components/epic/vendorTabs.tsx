import React from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Clock, ListChecks, History } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import VendorActiveCard from "./vendorActiveCard";
import VendorPendingCard from "./vendorPendingCard";
import VendorHistoryCard from "./vendorHistoryCard";

export default function VendorTabs() {
  const { tab } = useLocalSearchParams<{ tab: string }>();
  const activeTab = tab || "activos";

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
              <Text className="text-white text-xs">23</Text>
            </View>
          </View>
        </TabsTrigger>
        <TabsTrigger value="pendientes" className="flex-1 rounded-md px-2">
          <View className="flex-row items-center justify-center gap-1">
            <Clock size={18} />
            <Text>Pendientes</Text>
            <View className="bg-orange-500 rounded-full px-2">
              <Text className="text-white text-xs">44</Text>
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
        <VendorActiveCard
          date="12 de Marzo"
          productName="Arepas Rellenas de Carne y Queso"
          price={20000}
          lastUpdate="12 minutos"
          onChat={() => console.log("Chat pressed")}
          onMarkAsReady={() => console.log("Mark as ready pressed")}
        />
        <VendorActiveCard
          date="12 de Marzo"
          productName="Empanadas de Carne (x5)"
          price={15000}
          lastUpdate="15 minutos"
          onChat={() => console.log("Chat pressed")}
          onMarkAsReady={() => console.log("Mark as ready pressed")}
        />
        <VendorActiveCard
          date="12 de Marzo"
          productName="Tequeños (x8)"
          price={18000}
          lastUpdate="20 minutos"
          onChat={() => console.log("Chat pressed")}
          onMarkAsReady={() => console.log("Mark as ready pressed")}
        />
      </TabsContent>

      <TabsContent value="pendientes" className="px-4">
        <VendorPendingCard
          date="12 de Marzo"
          productName="Picada Samaria"
          price={35000}
          clientName="EdgarPerez"
          clientAddress="Calle 123 St 45 # 65 - Gaira"
          clientImage="https://picsum.photos/201"
          isNewOrder={true}
          lastUpdate="12 min"
          onChat={() => console.log("Chat pressed")}
          onAttendOrder={() => console.log("Attend order pressed")}
        />
        <VendorPendingCard
          date="12 de Marzo"
          productName="Hamburguesa Especial"
          price={28000}
          clientName="CarlosRodriguez"
          clientAddress="Av Principal #45-12"
          clientImage="https://picsum.photos/202"
          isNewOrder={true}
          lastUpdate="15 min"
          onChat={() => console.log("Chat pressed")}
          onAttendOrder={() => console.log("Attend order pressed")}
        />
        <VendorPendingCard
          date="12 de Marzo"
          productName="Pizza Familiar"
          price={42000}
          clientName="MariaGarcia"
          clientAddress="Calle 78 #23-45"
          clientImage="https://picsum.photos/203"
          isNewOrder={true}
          lastUpdate="18 min"
          onChat={() => console.log("Chat pressed")}
          onAttendOrder={() => console.log("Attend order pressed")}
        />
      </TabsContent>

      <TabsContent value="historial" className="px-4">
        <VendorHistoryCard
          date="11 de Marzo"
          products={["Arepas Rellenas de Carne y Queso", "Jugo de Mango"]}
          price={20000}
          clientName="Luis B"
          clientAddress="Calle 10 # 50 - Santa Marta"
          clientImage="https://picsum.photos/203"
          status="Entregado"
          timeline={[
            { status: "Pago recibido", time: "8:38 am" },
            { status: "Preparando el pedido", time: "8:45 am" },
            { status: "Listo para entregar/recoger", time: "9:15 am" },
            { status: "Entregado", time: "9:25 am" },
          ]}
        />
        <VendorHistoryCard
          date="11 de Marzo"
          products={["Pizza Familiar Hawaiana"]}
          price={35000}
          clientName="Maria G"
          clientAddress="Calle 15 # 45 - Santa Marta"
          clientImage="https://picsum.photos/202"
          status="Entregado"
          timeline={[
            { status: "Pago recibido", time: "2:30 pm" },
            { status: "Preparando el pedido", time: "2:35 pm" },
            { status: "Listo para entregar/recoger", time: "3:00 pm" },
            { status: "Entregado", time: "3:15 pm" },
          ]}
          onChat={() => console.log("Chat pressed")}
        />
        <VendorHistoryCard
          date="11 de Marzo"
          products={["Hamburguesa Especial", "Papas Fritas"]}
          price={25000}
          clientName="Carlos R"
          clientAddress="Calle 20 # 30 - Santa Marta"
          clientImage="https://picsum.photos/200"
          status="Entregado"
          timeline={[
            { status: "Pago recibido", time: "7:00 pm" },
            { status: "Preparando el pedido", time: "7:05 pm" },
            { status: "Listo para entregar/recoger", time: "7:25 pm" },
            { status: "Entregado", time: "7:40 pm" },
          ]}
          onChat={() => console.log("Chat pressed")}
        />
      </TabsContent>
    </Tabs>
  );
}
