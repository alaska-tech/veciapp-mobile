import { View, Image, ScrollView } from 'react-native';
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
    router.replace('/(tabs)');
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4 min-h-screen">
        <Image
          source={require('../assets/images/veciapplogo2.png')}
          className="w-48 h-48 mb-2"
          resizeMode="contain"
        />
        
        <Text className="text-2xl font-bold mb-8 text-center">
          Crear nueva cuenta
        </Text>

        <View className="w-full gap-4">
          <Input
            placeholder="Nombre completo"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="bg-muted"
          />

          <Input
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-muted"
          />

          <Input
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            className="bg-muted"
          />

          <Input
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            className="bg-muted"
          />

          <Button
            onPress={handleRegister}
            className="w-full mt-4"
          >
            <Text>Registrarse</Text>
          </Button>

          <Text className="text-center text-muted-foreground mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Text 
              className="text-primary"
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