import { View, Image, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

export default function MailVerifiedScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4 px-12 min-h-screen">
        <Image
          source={require('../../../assets/icons/ios-Light.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
        
        <Text className="text-xl font-bold mb-4 text-center">
          ¡Correo verificado con éxito!
        </Text>

        <Text className="text-md text-muted-foreground mb-8 text-center">
          Tu cuenta ha sido activada correctamente.¡Bienvenido a <Text className="font-semibold">VeciApp</Text>! Ya puedes iniciar sesión y comenzar a explorar.
        </Text>

        <Button
          onPress={() => {
            router.dismissAll();
            router.replace('/');
          }}
          className="w-full bg-yellow-400 rounded-full"
        >
          <Text className="text-black font-bold text-md">
            Ir al login
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}