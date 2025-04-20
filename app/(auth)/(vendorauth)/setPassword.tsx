import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Image } from "react-native";
import { Loader } from "~/components/ui/loader";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openTerms = () => {
    Linking.openURL("https://google.com");
  };

  const openPrivacy = () => {
    Linking.openURL("https://google.com");
  };

  const handleSavePassword = () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      router.replace("/vendorHome");
    }, 4000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background p-4 items-center justify-center px-12">
        <View className="items-center">
          <Image
            source={require("../../../assets/icons/ios-Light.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-center">
            {isLoading ? "Iniciando Sesión" : "Bienvenido, $(Nombre_usuario)"}
          </Text>
          {!isLoading && (
            <Text className="text-center text-muted-foreground mt-2">
              Todo listo, ahora crea tu contraseña para acceder a tu cuenta.
            </Text>
          )}
        </View>

        {!isLoading && (
          <View className="w-full mt-8 gap-4">
            <Input
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <Input
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
            />
          </View>
        )}

        <Button
          onPress={handleSavePassword}
          className="w-full bg-yellow-400 rounded-full mt-6 mb-20"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <Text className="text-black font-bold text-md">
              Guardar y continuar
            </Text>
          )}
        </Button>

        {!isLoading && (
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
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}