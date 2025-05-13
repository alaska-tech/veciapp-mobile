import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Calendar, MessageCircle, Clock } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

interface VendorActiveCardProps {
  date: string;
  productName: string;
  price: number;
  status?: string;
  lastUpdate?: string;
  onChat?: () => void;
  onMarkAsReady?: () => void;
}

export default function VendorActiveCard({
  date,
  productName,
  price,
  status = "Preparando",
  lastUpdate = "12 minutos",
  onChat,
  onMarkAsReady,
}: VendorActiveCardProps) {
  return (
    <Card className="rounded-3xl overflow-hidden mb-4 shadow-lg">
      <View className="p-6">
        {/* Date and Status Row */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Calendar size={20} color="#666666" />
            <Text className="ml-2 text-base text-muted-foreground">{date}</Text>
          </View>
          <View className="bg-orange-50 px-4 py-1.5 rounded-full">
            <Text className="text-orange-500 font-medium text-sm">{status}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">Productos</Text>
          <Text className="text-xl font-semibold mb-1">{productName}</Text>
          <Text className="text-2xl font-bold">
            ${price.toLocaleString()}
          </Text>
        </View>

        <Separator className="mb-6" />

        {/* Last Update */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Última actualización</Text>
          <View className="flex-row items-center">
            <Clock size={18} color="#666666" />
            <Text className="ml-2 text-base text-muted-foreground">
              Hace {lastUpdate}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row items-center justify-between">
          <Button
            className="bg-[#35B675] rounded-full px-6 flex-1 mr-2"
            onPress={onMarkAsReady}
          >
            <Text className="text-white font-semibold text-base">
              Marcar como listo para entrega
            </Text>
          </Button>
          
          <TouchableOpacity
            onPress={onChat}
            className="w-12 h-12 rounded-lg bg-gray-100 items-center justify-center"
          >
            <MessageCircle size={24} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}