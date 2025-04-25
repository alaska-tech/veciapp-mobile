import { View, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Trash2 } from 'lucide-react-native';

interface FavoriteCardProps {
  name: string;
  price: number;
  image: string | ImageSourcePropType;
  discount?: number;
  onDelete?: () => void;
  onWantIt?: () => void;  // Add new prop for the "Lo quiero" button
}

export default function FavoriteCard({
  name,
  price,
  image,
  discount,
  onDelete,
  onWantIt
}: FavoriteCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <Card className="rounded-3xl overflow-hidden mb-4">
      <View className="p-4">
        <View className="flex-row items-center">
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            className="w-20 h-20 rounded-full"
          />
          <View className="flex-1 ml-4 gap-2">
            <Text className="text-lg font-semibold" numberOfLines={2}>{name}</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-xl font-bold">${formatPrice(discountedPrice)}</Text>
              {discount && (
                <Text className="ml-2 text-gray-500">
                  Descuento {discount}%
                </Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Buttons row */}
        <View className="flex-row items-center justify-between mt-4">
          <Button
            className="flex-1 bg-yellow-400 rounded-full mr-2"
            size="lg"
            onPress={onWantIt}
          >
            <Text className="text-black font-bold text-xl">¡Lo quiero!</Text>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onPress={onDelete}
            className="h-12 w-12 justify-center items-center"
          >
            <Trash2 size={18} color="#666666" />
          </Button>
        </View>
      </View>
    </Card>
  );
}