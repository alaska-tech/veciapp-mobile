import { View, Image, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import logo from '~/assets/images/logoveciapp.png'

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // TODO: Implement password reset logic
    router.replace('/otpVerification');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4 px-12 min-h-screen">
        <Image
          source={logo}
          className="w-48 h-48"
          resizeMode="contain"
        />
        
        <Text className="text-2xl font-bold mb-2 text-center">
          Recuperar contraseña
        </Text>

        <Text className="text-sm text-muted-foreground mb-6 text-center">
          Ingresa tu correo electrónico para recuperar tu contraseña
        </Text>

        <View className="w-full gap-4">
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            onPress={handleResetPassword}
            className="w-full bg-yellow-400 rounded-full"
          >
            <Text className="text-black font-bold">Enviar instrucciones</Text>
          </Button>

          <Text className="text-center text-muted-foreground text-sm">
            ¿Recordaste tu contraseña?{' '}
            <Text 
              className="text-primary underline font-bold"
              onPress={() => router.push('/')}
            >
              Iniciar sesión
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}