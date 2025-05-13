import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react-native";

interface VendorPendingCardProps {
  date: string;
  productName: string;
  price: number;
  clientName: string;
  clientAddress: string;
  clientImage: string;
  isNewOrder?: boolean;
  lastUpdate?: string;
  onChat?: () => void;
  onAttendOrder?: () => void;
}

export default function VendorPendingCard({
  date,
  productName,
  price,
  clientName,
  clientAddress,
  clientImage,
  isNewOrder = false,
  lastUpdate = "12 min",
  onChat,
  onAttendOrder,
}: VendorPendingCardProps) {
  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  };

  return (
    <Card 
      className="rounded-3xl overflow-hidden mb-4 border-2 border-[#FFD100] bg-[#F7F3DF]" 
      style={cardShadow}
    >
      <View className="p-6">
        {/* Date and Status Row */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Calendar size={20} color="#666666" />
            <Text className="ml-2 text-base text-muted-foreground">{date}</Text>
          </View>
          {isNewOrder && (
            <View className="bg-red-100 px-4 py-1.5 rounded-full">
              <Text className="text-red-500 font-medium">
                Pedido nuevo • Hace {lastUpdate}
              </Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">Productos</Text>
          <Text className="text-xl font-semibold mb-1">{productName}</Text>
          <Text className="text-2xl font-bold">
            ${price.toLocaleString()}
          </Text>
        </View>

        {/* Client Info */}
        <View className="mb-6">
          <Text className="text-lg text-muted-foreground mb-2">Cliente</Text>
          <View className="flex-row items-center">
            <Image 
              source={{ uri: clientImage }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-xl font-semibold">{clientName}</Text>
              <Text className="text-base text-muted-foreground">{clientAddress}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row items-center justify-between">
          <Button
            className="bg-[#FFD100] rounded-full px-6 flex-1 mr-2"
            onPress={onAttendOrder}
          >
            <Text className="text-black font-semibold text-base">
              Atender Pedido
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