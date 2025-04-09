import { View, Image, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

export default function PasswordConfirmationScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4 px-12 min-h-screen">
        <Image
          source={require('../../assets/images/logoveciapp.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
        
        <Text className="text-2xl font-bold mb-2 text-center">
          ¡Revisa tu correo!
        </Text>

        <Text className="text-sm text-muted-foreground mb-6 text-center">
          Te enviamos un enlace para que recuperes tu contraseña; Sigue las instrucciones desde tu correo.
        </Text>

        <View className="w-full gap-4">
          <Button
            onPress={() => router.push('/')}
            className="w-full bg-yellow-400 rounded-full"
          >
            <Text className="text-black font-bold">Volver al Inicio de Sesión</Text>
          </Button>

          <Text className="text-center text-muted-foreground text-sm">
            ¿No te ha llegado aún?{' '}
            <Text 
              className="text-primary underline font-bold"
              onPress={() => router.back()}
            >
              Reenviar correo
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}