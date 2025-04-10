import { View, Image, ScrollView, Linking } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = () => {
    // TODO: Implement registration logic
    router.push('/otpVerification');
  };

  const openTerms = () => {
    Linking.openURL('https://google.com');
  };

  const openPrivacy = () => {
    Linking.openURL('https://google.com');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4 px-12 min-h-screen">
        <Image
          source={require('../../assets/images/logoveciapp.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
        
        <Text className="text-2xl font-bold mb-2 text-center">
          Crear una nueva cuenta
        </Text>

        <Text className="text-sm text-muted-foreground mb-6 text-center">
          Ingresa tus datos para registrarte
        </Text>

        <View className="w-full gap-4">
          <Input
            placeholder="Nombre completo"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Input
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />

          <Input
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
          />

          <Button
            onPress={handleRegister}
            className="w-full bg-yellow-400 rounded-full"
          >
            <Text className="text-black font-bold text-md">Registrarse</Text>
          </Button>

          <Text className="text-center text-muted-foreground text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Text 
              className="text-primary underline font-bold"
              onPress={() => router.push('/')}
            >
              Iniciar sesión
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
    </ScrollView>
  );
}