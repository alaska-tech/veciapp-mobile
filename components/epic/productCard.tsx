import {
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { HandPlatter, MapPin, Package, Star } from "lucide-react-native";
import { ReactNode } from "react";

interface ProductCardProps {
  title: string;
  price: number;
  distance: string;
  rating?: number;
  category: string;
  imageUrl: string | ImageSourcePropType;
  discount?: number;
  type: string;
  onPress?: () => void;
}

const ProductServiceTypeRender: Record<string, any> = {
  product: <Package size={16} color="#666" />,
  service: <HandPlatter size={16} color="#666" />,
};
const ProductServiceCategoryTag: Record<string, any> = {
  Belleza: (
    <Badge
      variant="secondary"
      className="rounded-full px-3 py-1 self-start bg-pink-100"
    >
      <Text className="text-pink-600">Belleza</Text>
    </Badge>
  ),
  Confecciones: (
    <Badge
      variant="secondary"
      className="rounded-full px-3 py-1 self-start bg-orange-50"
    >
      <Text className="text-orange-600">Confecciones</Text>
    </Badge>
  ),
  Gastronomía: (
    <Badge
      variant="secondary"
      className="rounded-full px-3 py-1 self-start bg-gray-100"
    >
      <Text className="text-gray-600">Gastronomía</Text>
    </Badge>
  ),
};
export default function ProductCard({
  title,
  price,
  distance,
  rating,
  category,
  imageUrl,
  discount,
  type,
  onPress,
}: ProductCardProps) {
  const imageSource =
    typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="w-full h-auto shadow"
    >
      <Card className="overflow-hidden rounded-t-full rounded-b-[3458px] p-4 items-center">
        <Image
          source={imageSource}
          className="w-28 h-28 rounded-full"
          resizeMode="cover"
        />
        <CardContent className="p-2 flex-1 center">
          <View className="flex-col gap-1">
            <Text
              className="text-xl font-semibold text-center"
              numberOfLines={2}
            >
              {title}
            </Text>

            {!!rating ? (
              <View className="flex-row items-center justify-center gap-1">
                <Star size={18} color="#666666" fill="#FFFF00" />
                <Text className="text-md text-gray-500" numberOfLines={1}>
                  {rating}
                </Text>
              </View>
            ) : (
              <View></View>
            )}

            {!!distance ? (
              <View className="flex-row items-center gap-1">
                <MapPin size={18} color="#ffffff" fill="#666" />
                <Text className="text-md text-gray-500" numberOfLines={1}>
                  {distance} de distancia
                </Text>
              </View>
            ) : (
              <View></View>
            )}
            <View className="flex-row items-center gap-2 mb-2 justify-center">
              {ProductServiceTypeRender[type]}
              {ProductServiceCategoryTag[category]}
            </View>
            <View className="flex-col items-center justify-between">
              <Text className="text-2xl font-bold">
                ${price.toLocaleString()}
              </Text>
              {!!discount ? (
                <Badge variant="destructive" className="px-1 py-0.5">
                  <Text className="text-xs text-yellow-200">
                    {discount}% off
                  </Text>
                </Badge>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
