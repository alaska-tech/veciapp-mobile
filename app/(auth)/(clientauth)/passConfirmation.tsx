import { View, Image, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

export default function PassConfirmationScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4 px-12 min-h-screen">
        <Image
          source={require('../../../assets/images/logoveciapp.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
        
        <Text className="text-xl font-bold mb-4 text-center">
          ¡Revisa tu correo!
        </Text>

        <Text className="text-md text-muted-foreground mb-8 text-center">
          Te enviamos un enlace de verificación a tu correo. Ábrelo y haz clic en el botón para confirmar tu dirección.
        </Text>

        <View className="w-full gap-6">
          <View>
            <Text className="text-sm text-muted-foreground text-center mb-4">
              ¿No te ha llegado aún?
            </Text>
            <Text 
              className="text-blue-500 bg-gray-50 p-4 rounded-lg text-center text-md border border-gray-100"
              onPress={() => router.push('/mailVerified')} 
            >
              Reenviar correo
            </Text>
          </View>

          <Text 
            className="text-muted-foreground text-center"
          >
            Volver al <Text className="font-bold" onPress={() => {
              router.dismissAll();
              router.navigate('/');
            }}>Inicio de Sesión</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}