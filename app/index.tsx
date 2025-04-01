import { View, Image } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    router.replace('/(tabs)');
  };

  const handleEmailSignIn = () => {
    // TODO: Implement Email Sign In
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <Image
        source={require('../assets/images/veciapplogo2.png')}
        className="w-64 h-64 mb-8"
        resizeMode="contain"
      />
      
      <Text className="text-2xl font-bold mb-8 text-center">
        Bienvenido a VeciApp
      </Text>

      <View className="w-full gap-4">
        <Button
          onPress={handleGoogleSignIn}
          className="w-full flex-row items-center justify-center gap-2 bg-white"
        >
          <Text className="text-black">Continuar con Google</Text>
        </Button>

        <Button
          onPress={handleEmailSignIn}
          className="w-full"
        >
          <Text>Continuar con Email</Text>
        </Button>

        <Text className="text-center text-muted-foreground mt-4">
          ¿No tienes una cuenta?{' '}
          <Text 
            className="text-primary"
            onPress={() => router.push('/register')}
          >
            Regístrate
          </Text>
        </Text>
      </View>
    </View>
  );
}