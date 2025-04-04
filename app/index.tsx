import { View, Image } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSignIn = () => {
    // TODO: Implement Sign In
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <Image
        source={require('../assets/images/logoveciapp.png')}
        className="w-48 h-48"
        resizeMode="contain"
      />
      
      <Text className="text-2xl font-bold mb-2 text-center">
        ¡Bienvenido a VeciApp!
      </Text>

      <Text className="text-sm text-muted-foreground mb-6 text-center">
        Ingresa tu correo electrónico
      </Text>

      <View className="w-full gap-4">
        <Input
          placeholder="correo@dominio.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className=""
        />

        <Button
          onPress={handleSignIn}
          className="w-full bg-yellow-400 rounded-full"
        >
          <Text className="text-black font-bold">Inicia Sesión</Text>
        </Button>

        <Text className="text-center text-muted-foreground text-sm">
          ¿No tienes cuenta? {' '}
          <Text 
            className="text-primary underline font-medium"
            onPress={() => router.push('/register')}
          >
            Regístrate aquí
          </Text>
        </Text>

        <Text className="text-xs text-center text-muted-foreground mt-4">
          Al hacer clic en continuar, aceptas nuestros{' '}
          <Text className="text-primary">Términos de Servicio</Text> y{' '}
          <Text className="text-primary">Política de Privacidad</Text>
        </Text>
      </View>
    </View>
  );
}