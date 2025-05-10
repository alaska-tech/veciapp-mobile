import React from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Clock, ListChecks, History } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";

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

      <TabsContent value="activos">
        <Card>
          <CardContent className="p-4">
            <Text className="text-lg font-semibold">Pedidos Activos</Text>
            <Text className="text-gray-500">
              Aquí puedes ver los pedidos que están en proceso
            </Text>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pendientes">
        <Card>
          <CardContent className="p-4">
            <Text className="text-lg font-semibold">Pedidos Pendientes</Text>
            <Text className="text-gray-500">
              Pedidos que necesitan tu confirmación
            </Text>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="historial">
        <Card>
          <CardContent className="p-4">
            <Text className="text-lg font-semibold">Historial de Pedidos</Text>
            <Text className="text-gray-500">
              Registro completo de pedidos anteriores
            </Text>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
