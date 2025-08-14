import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Calendar, ChevronDown, ChevronUp, MessageCircleMore } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

interface TimelineItem {
  status: string;
  time: string;
}

interface OrderDetailCardProps {
  date: string;
  productName: string;
  productImage: string;
  price: number;
  discount?: number;
  status: string;
  timeline: TimelineItem[];
  onCoordinateDelivery?: () => void;
  onCancelOrder?: () => void;
}

export default function OrderDetailCard({
  date,
  productName,
  productImage,
  price,
  discount,
  status,
  timeline,
  onCoordinateDelivery,
  onCancelOrder,
}: OrderDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparando el pedido":
        return "bg-yellow-100";
      case "listo para entregar":
        return "bg-blue-100";
      case "entregado":
        return "bg-green-100";
      case "cancelado":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "preparando el pedido":
        return "text-yellow-700";
      case "listo para entregar":
        return "text-blue-700";
      case "entregado":
        return "text-green-700";
      case "cancelado":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <Card 
      className="rounded-3xl overflow-hidden mb-4" 
      style={cardShadow}
    >
      <View className="p-6">
        {/* Date and Status Row */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Calendar size={20} color="#666666" />
            <Text className="ml-2 text-base text-muted-foreground">{date}</Text>
          </View>
          <View className={`px-4 py-1.5 rounded-full ${getStatusColor(status)}`}>
            <Text className={`font-medium ${getStatusTextColor(status)}`}>{status}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Image 
              source={imageError ? require("~/assets/images/food.png") : { uri: productImage }}
              className="w-20 h-20 rounded-full"
              style={{ width: 80, height: 80, borderRadius: 40 }}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
            <View className="ml-4 flex-1">
              <Text className="text-xl font-semibold mb-1">{productName}</Text>
              <Text className="text-2xl font-bold">
                ${price.toLocaleString()}
              </Text>
              {discount && (
                <View className="bg-pink-100 px-2 py-1 rounded-full mt-1 self-start">
                  <Text className="text-red-600 text-sm font-medium">
                    Descuento {discount}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Coordinate Delivery Button */}
        <TouchableOpacity 
          onPress={onCoordinateDelivery}
          className="bg-yellow-400 rounded-full py-4 mb-6 flex-row items-center justify-center"
        >
          <MessageCircleMore size={20} color="#000" />
          <Text className="text-black text-center font-semibold text-lg ml-2">
            Chatear entrega
          </Text>
        </TouchableOpacity>

        <Separator className="mb-6" />

        {/* Timeline Dropdown */}
        <TouchableOpacity 
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex-row items-center justify-between"
        >
          <Text className="text-lg font-semibold">Detalles de la compra</Text>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </TouchableOpacity>

        {isExpanded && (
          <View className="ml-4 mt-6">
            {timeline.map((item, index) => (
              <View key={index} className="flex-row items-start">
                <View className="mr-4 items-center">
                  <View className="w-3 h-3 rounded-full bg-[#00563B]" />
                  {index < timeline.length - 1 && (
                    <View className="w-0.5 h-12 bg-[#00563B]" />
                  )}
                </View>
                <View className="flex-1 mb-4">
                  <Text className="text-base font-semibold text-[#00563B]">
                    {item.status}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {item.time}
                  </Text>
                </View>
              </View>
            ))}
            
            {/* Cancel Order Button */}
            <TouchableOpacity 
              onPress={onCancelOrder}
              className="border border-red-500 rounded-full py-3 mt-4"
            >
              <Text className="text-red-500 text-center font-semibold text-lg">
                Cancelar Pedido
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );
} 