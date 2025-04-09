import { View, Image, Linking } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    if (!showPassword) {
      setShowPassword(true);
    } else {
      console.log("se logeo ok")
      // TODO: Implement Sign In
      router.replace('/(tabs)');
    }
  };

  const openTerms = () => {
    Linking.openURL('https://google.com');
  };

  const openPrivacy = () => {
    Linking.openURL('https://google.com');
  };

  return (
    <View className="flex-1 items-center justify-center p-4 px-12 bg-background">
      <Image
        source={require('../assets/images/logoveciapp.png')}
        className="w-56 h-48"
        resizeMode="contain"
      />
      
      <Text className="text-2xl font-bold text-center">
        ¡Qué más, Veci!
      </Text>
      <Text className="text-2xl font-bold mb-2 text-center">
        Bienvenido de vuelta a VeciApp.
      </Text>

      <Text className="text-md text-muted-foreground mb-6 text-center">
        Ingresa tu correo pa' iniciar sesión.
      </Text>

      <View className="w-full gap-4">
        <Input
          placeholder="correo@dominio.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="rounded-xl"
        />

        {showPassword && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Input
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="rounded-xl"
            />
          </Animated.View>
        )}

        <Button
          onPress={handleSignIn}
          className="w-full bg-yellow-400 rounded-full"
        >
          <Text className="text-black font-bold">
            {showPassword ? "Vamos allá" : "Continuar"}
          </Text>
        </Button>

        <Text className="text-center text-muted-foreground text-md">
          ¿No tienes cuenta? {' '}
          <Text 
            className="text-primary underline font-bold"
            onPress={() => router.push('/register')}
          >
            Regístrate aquí
          </Text>
        </Text>

        <Text className="text-center text-muted-foreground text-md">
          ¿Olvidaste tu contraseña? {' '}
          <Text
            className="text-primary underline font-bold"
            onPress={() => router.push('/forgotPassword')}
          >
            Recupérala aquí
          </Text>
        </Text>

        <Text className="text-xs text-center text-muted-foreground mt-16">
          Al seguir, aceptas nuestros{'\n'}
          <Text className="text-primary font-semibold py-1 leading-6" onPress={openTerms}>
            Términos de Servicio
          </Text> y{' '}
          <Text className="text-primary font-semibold py-1 leading-6" onPress={openPrivacy}>
            Política de Privacidad
          </Text>
        </Text>
      </View>
    </View>
  );
}