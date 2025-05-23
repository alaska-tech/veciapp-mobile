import {
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from "react-native";
import React, { useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Image } from "react-native";
import { ChevronLeft } from "lucide-react-native";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // Fix: Add proper typing for the refs array
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();

  const openTerms = () => {
    Linking.openURL("https://google.com");
  };

  const openPrivacy = () => {
    Linking.openURL("https://google.com");
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = () => {
    const otpValue = otp.join("");
    console.log("OTP:", otpValue);
    // Navigate to onboarding1
    router.push("/setPassword");
  };

  {
    /* 
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
      */
  }
  // stack screen por defecto <Stack.Screen options={{ headerShown: true, title: 'Verificate', headerBackTitle: "volver", headerTitleAlign: 'center' }} />
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background p-4 items-center justify-center px-12">
        {/*<Stack.Screen options={{ headerShown: true, title: 'Verifícate', headerBackTitle: "volver", headerTitleAlign: 'center' }} />*/}

        {/* <View className="items-center">
        <Image
          source={require('../../assets/images/logoveciapp.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>*/}

        <View className="items-center">
          <Image
            source={require("../../../assets/icons/ios-Light.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-center">
            Ingresa tu código
          </Text>
          <Text className="text-center text-muted-foreground mt-2">
            Ingresa el código único que te asignó la Fundación Maleua.
          </Text>
        </View>

        <View className="w-full mt-4">
          <Text className="font-medium mb-2 pl-6">Código</Text>

          <View className="flex-row justify-center gap-3">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 border-2 border-gray-200 rounded-lg text-center text-xl"
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    handleBackspace(index);
                  }
                }}
              />
            ))}
          </View>
        </View>

        <Button
          onPress={handleVerification}
          className="w-full bg-yellow-400 rounded-full mt-6 mb-20"
        >
          <Text className="text-black font-bold text-md">Verificar</Text>
        </Button>

        <Text className="text-center text-muted-foreground mt-4">
          Al seguir, aceptas nuestros{" "}
          <Text className="text-primary font-semibold" onPress={openTerms}>
            Términos
          </Text>{" "}
          y{" "}
          <Text className="text-primary font-semibold" onPress={openPrivacy}>
            Políticas de Privacidad
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
