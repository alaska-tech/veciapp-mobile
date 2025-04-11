import { View, Image } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

export default function Onboarding4() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-yellow-100">
      <View className="flex-row justify-end p-4">
        <Text 
          className="text-emerald-800 text-lg font-bold pt-14 mr-4"
          onPress={() => router.replace('/(tabs)')}
        >
          Saltar
        </Text>
      </View>

      <View className="flex-1 items-center justify-center relative">
        <Image
          source={require('../../assets/images/onboarding4.png')}
          className="w-72 h-72 -mt-40"
          resizeMode="contain"
        />

        <View className="absolute bottom-12 px-8 w-full">
          <Text className="text-3xl text-emerald-800 font-bold text-center mb-4">
            ¡Empieza a comprar y apoyar!
          </Text>

          <Text className="text-center text-emerald-800 font-medium mb-8">
            Explora, conéctate y sé parte del cambio en tu comunidad.
          </Text>

          <View className="flex-row justify-center gap-2 mb-4">
            <View className="w-2 h-2 rounded-full bg-emerald-800/30" />
            <View className="w-2 h-2 rounded-full bg-emerald-800/30" />
            <View className="w-2 h-2 rounded-full bg-emerald-800/30" />
            <View className="w-2 h-2 rounded-full bg-emerald-800" />
          </View>

          <Button
            onPress={() => {
              router.dismissAll();
              router.replace('/(tabs)');
            }}
            className="w-full bg-yellow-400 rounded-full flex-row items-center justify-center gap-2 shadow-md"
          >
            <Text className="text-black font-bold">Empezar</Text>
            <ArrowRight size={20} color="black" />
          </Button>
        </View>
      </View>
    </View>
  );
}