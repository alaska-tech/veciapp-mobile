import { View, Image } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

export default function Onboarding1() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-emerald-200">
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
          source={require('../../assets/images/onboarding1.png')}
          className="w-72 h-72 -mt-40"
          resizeMode="contain"
        />

        <View className="absolute bottom-12 px-8 w-full">
          <Text className="text-3xl text-emerald-800 font-bold text-center mb-4">
            VeciApp: Hecho para nuestra gente
          </Text>

          <Text className="text-center text-emerald-800 font-medium mb-8">
            Conecta con emprendedores locales y descubre productos y servicios de tu comunidad.
          </Text>

          <Button
            onPress={() => router.push('/onboarding2')}
            className="w-full bg-yellow-400 rounded-full flex-row items-center justify-center gap-2"
          >
            <Text className="text-black font-bold">Siguiente</Text>
            <ArrowRight size={20} color="black" />
          </Button>
        </View>
      </View>
    </View>
  );
}