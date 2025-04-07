import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import logo from '~/assets/images/logoveciapp.png';
import { Image } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const router = useRouter();

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerification = () => {
    const otpValue = otp.join('');
    console.log('OTP:', otpValue);
    // Navigate to onboarding1
    router.push('/onboarding1');
  };

  
    {/* */}
    // stack screen por defecto <Stack.Screen options={{ headerShown: true, title: 'Verificate', headerBackTitle: "volver", headerTitleAlign: 'center' }} />
  return (
    <View className="flex-1 bg-background p-4 items-center justify-center px-12">
        
        
      <Stack.Screen 
        options={{ 
          headerShown: true, 
            title: 'Verificate', 
            headerBackTitle: "Volver",
            headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/register')}>
                <ChevronLeft size={24} color="black" />
            </TouchableOpacity>
          )
        }} //bloque importante - no eliminar
      />
      
      <View className="items-center mt-10">
        <Image
          source={logo}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>

      <View className="mt-8">
        <Text className="text-2xl font-bold text-center">Verificate</Text>
        <Text className="text-center text-muted-foreground mt-2">
          Introduce el código que se envió a tu cuenta de correo electrónico
        </Text>

        <View className="flex-row justify-center mt-8 gap-3">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              className="w-12 h-12 border-2 border-muted rounded-lg text-center text-xl"
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index);
                }
              }}
            />
          ))}
        </View>
      </View>

      <Button
        onPress={handleVerification}
        className="w-full bg-yellow-400 rounded-full mt-8"
      >
        <Text className="text-black font-bold">Autenticar</Text>
      </Button>

      <TouchableOpacity className="mt-4">
        <Text className="text-center text-muted-foreground">
          Reenviar código: <Text className="text-black">05:00</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}