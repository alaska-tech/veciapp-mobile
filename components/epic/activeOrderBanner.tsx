import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { ShoppingCart } from "lucide-react-native";

interface ActiveOrderBannerProps {
  onPress: () => void;
  orderCount?: number;
}

export default function ActiveOrderBanner({ 
  onPress, 
  orderCount = 1 
}: ActiveOrderBannerProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-yellow-400 rounded-full py-4 px-6 mb-4"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-start">
        <ShoppingCart size={24} color="#000000" />
        <Text className="text-black font-bold text-lg ml-3">
          {orderCount} Pedido Activo
        </Text>
      </View>
    </TouchableOpacity>
  );
} 