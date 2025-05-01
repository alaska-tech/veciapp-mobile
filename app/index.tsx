import React from "react";
import { View, Image, Linking } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Loader } from "~/components/ui/loader";
import { useRouter } from "expo-router";
import { useState } from "react";
import { validateEmail, validatePassword } from '~/lib/validations';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateLogin = (): boolean => {
    if (!showPassword) {
      const emailError = validateEmail(email);
      setErrors({ ...errors, email: emailError || '' });
      return !emailError;
    }

    const newErrors = {
      email: validateEmail(email) || '',
      password: validatePassword(password) || '',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSignIn = () => {
    if (!validateLogin()) return;

    if (!showPassword) {
      setShowPassword(true);
    } else {
      setIsLoading(true);
      // Simulate login delay de 4 segundos
      setTimeout(() => {
        if (password === "Miclave.1") {
          router.replace("/(client)/home");
        } else if (password === "Miclave.2") {
          router.replace("/vendorHome");
        }
      }, 4000);
    }
  };

  const openTerms = () => {
    Linking.openURL("https://google.com");
  };

  const openPrivacy = () => {
    Linking.openURL("https://google.com");
  };

  return (
    <View className="flex-1 items-center justify-center p-4 px-12 bg-background">
      <Image
        source={require("../assets/images/onboarding1.png")}
        className="w-80 h-80"
        resizeMode="contain"
      />

      {isLoading ? (
        <Text className="text-xl font-bold mb-5 text-center">
          Iniciando Sesión
        </Text>
      ) : (
        <Text className="text-sm text-muted-foreground text-left w-full mt-4">
          Ingresa tu correo electrónico
        </Text>
      )}

      <View className="w-full gap-4">
        <Input
          placeholder="correo@dominio.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: '' });
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          className="rounded-xl"
          editable={!isLoading}
        />
        {errors.email ? (
          <Text className="text-red-500 text-xs">{errors.email}</Text>
        ) : null}

        {showPassword && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text className="text-sm text-muted-foreground text-left w-full mt-4">
              Escribe tu contraseña
            </Text>
            <Input
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              className="rounded-xl"
              editable={!isLoading}
            />
            {errors.password ? (
              <Text className="text-red-500 text-xs">{errors.password}</Text>
            ) : null}
          </Animated.View>
        )}

        <Button
          onPress={handleSignIn}
          className="w-full bg-yellow-400 rounded-full mb-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <Text className="text-black font-bold text-md">
              {showPassword ? "Iniciar sesión" : "Continuar"}
            </Text>
          )}
        </Button>

        {!isLoading && (
          <>
            <Text
              className="text-blue-500 font-medium text-center text-md mb-6"
              onPress={() => router.push("/forgotPassword")}
            >
              No recuerdo mi clave
            </Text>

            <View className="flex-row justify-center items-center mt-2">
              <Text className="text-md text-muted-foreground">
                ¿No tienes cuenta?{" "}
              </Text>
              <Text
                className="text-primary font-bold underline text-md"
                onPress={() => router.push("/register")}
              >
                Regístrate aquí
              </Text>
            </View>

            <Text className="text-center text-muted-foreground mt-4">
              Al seguir, aceptas nuestros{" "}
              <Text className="text-primary font-semibold" onPress={openTerms}>
                Términos
              </Text>{" "}
              y{" "}
              <Text
                className="text-primary font-semibold"
                onPress={openPrivacy}
              >
                Políticas de Privacidad
              </Text>
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
