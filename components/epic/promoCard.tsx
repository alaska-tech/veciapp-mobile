import { Image, ImageSourcePropType, View } from 'react-native';
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

interface PromoCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string | ImageSourcePropType;
  onPress?: () => void;
}

export default function PromoCard({ 
  title, 
  subtitle, 
  buttonText, 
  image, 
  onPress 
}: PromoCardProps) {
  const imageSource = typeof image === 'string' 
    ? { uri: image }
    : image;

  return (
    <Card className="flex-row overflow-hidden rounded-xl bg-pink-200 mb-4">
      <CardContent className="flex-1 justify-center py-4">
        <Text className="text-3xl font-bold mb-1">
          {title}
        </Text>
        <Text className="text-xl mb-4">
          {subtitle}
        </Text>
        <Button 
          onPress={onPress}
          className="w-full bg-yellow-400 rounded-full"
        >
            <Text className="text-black font-bold text-lg">{buttonText}</Text>
        </Button>
      </CardContent>

      <Image
        source={imageSource}
        className="w-44 h-full p-4 rounded-xl"
        resizeMode="cover"
      />
    </Card>
  );
}