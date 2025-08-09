import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

interface OrderHistoryCardProps {
  productName: string;
  productImage: string;
  vendorName: string;
  total: number;
  onViewDetails: () => void;
}

export default function OrderHistoryCard({
  productName,
  productImage,
  vendorName,
  total,
  onViewDetails,
}: OrderHistoryCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <Card className="mb-4 mx-0 rounded-3xl bg-white border-0 shadow">
      <CardContent className="p-4">
        <View className="flex-row items-center">
          {/* Product Image */}
          <View className="mr-4">
            <Image
              source={{ uri: productImage }}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
          </View>
          
          {/* Product Details */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {productName}
            </Text>
            <Text className="text-sm text-gray-600 mb-2">
              Veci: {vendorName}
            </Text>
            <Text className="text-sm font-medium text-gray-900">
              Total: {formatPrice(total)}
            </Text>
          </View>
        </View>
        
        {/* View Details Button */}
        <View className="mt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-full border-gray-200 bg-gray-100"
            onPress={onViewDetails}
          >
            <Text className="text-gray-700 font-normal">Ver detalles</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
} 