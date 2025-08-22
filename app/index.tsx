import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Linking,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Loader } from "~/components/ui/loader";
import { useRouter } from "expo-router";
import { useState } from "react";
import { validateEmail, validatePassword } from "~/lib/validations";
import useAuthAction from "~/actions/auth.action";
import {
  clearAllInfoFromLocalStorage,
  setToken,
  setUserInfo,
} from "~/actions/localStorage.actions";
import { refreshParameters } from "~/actions/parameter.action";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import {
  registerForPushNotifications,
  sendImmediateNotification,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from "~/lib/notifications";

export default function LoginScreen() {
  const router = useRouter();
  const { logIn } = useAuthAction();
  const loginMutation = logIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const { refreshAuthInfo } = useAuth();

  // Configurar notificaciones al cargar el componente
  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      // Registrar para notificaciones push
      const token = await registerForPushNotifications();
      if (token) {
        console.log('Dispositivo registrado para notificaciones push');
      }

      // Configurar listener para notificaciones recibidas en primer plano
      const receivedSubscription = addNotificationReceivedListener(notification => {
        console.log('Notificación recibida en primer plano:', notification);
      });

      // Configurar listener para notificaciones tocadas
      const responseSubscription = addNotificationResponseReceivedListener(response => {
        console.log('Usuario tocó la notificación:', response);
        // Aquí puedes navegar a una pantalla específica basada en la notificación
        const data = response.notification.request.content.data;
        if (data?.screen && typeof data.screen === 'string') {
          // Validar que la ruta sea válida antes de navegar
          const screenPath = data.screen as string;
          if (screenPath.startsWith('/')) {
            router.push(screenPath as any);
          }
        }
      });

      // Cleanup al desmontar el componente
      return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
      };
    } catch (error) {
      console.error('Error al configurar notificaciones:', error);
    }
  };

  // Función para probar notificaciones locales
  const testNotification = async () => {
    try {
      await sendImmediateNotification(
        '¡Bienvenido a Veciapp! 🎉',
        'Tu sesión ha sido iniciada exitosamente.',
        { screen: '/home' }
      );
      console.log('Notificación de prueba enviada');
    } catch (error) {
      console.error('Error al enviar notificación de prueba:', error);
    }
  };

  useEffect(() => {
    if (showPassword) {
      passwordRef.current?.focus();
    }
  }, [showPassword]);

  const validateLogin = (): boolean => {
    if (!showPassword) {
      const emailError = validateEmail(email);
      setErrors({ ...errors, email: emailError || "" });
      return !emailError;
    }

    const newErrors = {
      email: validateEmail(email) || "",
      password: validatePassword(password) || "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSignIn = async () => {
    if (!validateLogin()) return;
    try {
      if (!showPassword) {
        setShowPassword(true);
        return;
      }

      setIsLoading(true);
      const response = await loginMutation.mutateAsync({
        body: {
          email: email.trim(),
          password: password,
        },
      });

      if (!response?.data?.data) {
        throw new Error("Invalid response from server");
      }

      const { token, user } = response.data.data;

      await setUserInfo(user);
      await setToken(token);
      await refreshParameters();
      await refreshAuthInfo();

              // Enviar notificación de bienvenida
        try {
          await sendImmediateNotification(
            '¡Bienvenido de vuelta! 👋',
            `Hola ${(user as any).name || user.email}, tu sesión ha sido iniciada exitosamente.`,
            { screen: '/home' }
          );
        } catch (notificationError) {
          console.error('Error al enviar notificación de bienvenida:', notificationError);
        }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        "El correo o contraseña son incorrectos. Por favor intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openTerms = () => {
    Linking.openURL("https://google.com");
  };

  const openPrivacy = () => {
    Linking.openURL("https://google.com");
  };

  const devButton = (
    <>
      {process.env.EXPO_PUBLIC_DEV_PURPOSES_CUSTOMER_USER &&
      process.env.EXPO_PUBLIC_DEV_PURPOSES_CUSTOMER_PSW ? (
        <Button
          onPress={async () => {
            setShowPassword(true);
            setEmail(process.env.EXPO_PUBLIC_DEV_PURPOSES_CUSTOMER_USER || "");
            setPassword(
              process.env.EXPO_PUBLIC_DEV_PURPOSES_CUSTOMER_PSW || ""
            );
            await handleSignIn();
          }}
          variant="outline"
        >
          <Text className="text-black font-bold text-md">
            Customer jangulo.dev@gmail.com
          </Text>
        </Button>
      ) : (
        <></>
      )}
      {process.env.EXPO_PUBLIC_DEV_PURPOSES_VENDOR_USER &&
      process.env.EXPO_PUBLIC_DEV_PURPOSES_VENDOR_PSW ? (
        <Button
          onPress={async () => {
            setShowPassword(true);
            setEmail(process.env.EXPO_PUBLIC_DEV_PURPOSES_VENDOR_USER || "");
            setPassword(process.env.EXPO_PUBLIC_DEV_PURPOSES_VENDOR_PSW || "");
            await handleSignIn();
          }}
          variant="outline"
        >
          <Text className="text-black font-bold text-md">
            VENDOR jangulo.dev@gmail.com
          </Text>
        </Button>
      ) : (
        <></>
      )}
    </>
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              setErrors({ ...errors, email: "" });
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
              <View className="relative">
                <Input
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({ ...errors, password: "" });
                  }}
                  secureTextEntry={!isPasswordVisible}
                  className="rounded-xl pr-12"
                  editable={!isLoading}
                  ref={passwordRef}
                />
                <TouchableOpacity
                  className="absolute right-3 top-0 bottom-0 justify-center"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={20} color="#666" />
                  ) : (
                    <Eye size={20} color="#666" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-xs">{errors.password}</Text>
              ) : null}
            </Animated.View>
          )}

          <Button
            onPress={async () => {
              await handleSignIn();
            }}
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

          {/* Botón de prueba de notificaciones */}
          {!isLoading && showPassword && (
            <Button
              onPress={testNotification}
              variant="outline"
              className="w-full rounded-full mb-4"
            >
              <Text className="text-blue-600 font-bold text-md">
                🔔 Probar Notificación
              </Text>
            </Button>
          )}
          {devButton}
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
    </TouchableWithoutFeedback>
  );
}
