import {
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Badge } from "~/components/ui/badge";
import { MapPin, Star } from "lucide-react-native";

interface ProductCardProps {
  title: string;
  price: number;
  distance: string;
  rating?: number;
  category: string;
  imageUrl: string | ImageSourcePropType;
  discount?: number;
  onPress?: () => void;
}

export default function ProductCard({
  title,
  price,
  distance,
  rating,
  category,
  imageUrl,
  discount,
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
        <CardContent className="p-2">
          <View className="flex-col gap-1">
            <Text
              className="text-xl font-semibold text-center"
              numberOfLines={2}
            >
              {title}
            </Text>

            {rating !== undefined && (
              <View className="flex-row items-center justify-center gap-1">
                <Star size={18} color="#666666" fill="#FFFF00" />
                <Text className="text-md text-gray-500" numberOfLines={1}>
                  {rating}
                </Text>
              </View>
            )}

            {distance && (
              <View className="flex-row items-center gap-1">
                <MapPin size={18} color="#ffffff" fill="#666" />
                <Text className="text-md text-gray-500" numberOfLines={1}>
                  {distance} de distancia
                </Text>
              </View>
            )}

            <Text
              className="text-xs text-red-500 text-center font-medium"
              numberOfLines={2}
            >
              {category}
            </Text>

            <View className="flex-col items-center justify-between">
              <Text className="text-2xl font-bold">
                ${price.toLocaleString()}
              </Text>
              {discount && (
                <Badge variant="destructive" className="px-1 py-0.5">
                  <Text className="text-xs text-yellow-200">
                    {discount}% off
                  </Text>
                </Badge>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
