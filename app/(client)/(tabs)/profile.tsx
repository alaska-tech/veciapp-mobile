import { SafeAreaView, ScrollView, View, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Bell,
  UserCircle,
  ChevronRight,
  TimerReset,
  UserX,
  PackageOpen,
  Headphones,
  MapPin,
  MessageCircleQuestion,
  Users,
} from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent } from "~/components/ui/card";
import { TouchableOpacity } from "react-native";
import { Switch } from "~/components/ui/switch";
import useAuthAction from "~/actions/auth.action";
import { clearAllInfoFromLocalStorage } from "~/actions/localStorage.actions";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import useCustomerAction from "~/actions/customer.action";
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNotificationSettings } from '~/hooks/useNotificationSettings';

export default function ProfileScreen() {
  const router = useRouter();
  const authActions = useAuthAction();
  const logOut = authActions.logOut();
  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const customer = customerActions.getCustomerDetails(user?.foreignPersonId);
  const {
    fullName = "",
    email = "",
    address = '{"address":"Desconocido"}',
  } = customer.data ?? {};
  const parsedAddress = JSON.parse(address);

  // Hook para manejar configuración de notificaciones
  const { 
    notificationsEnabled, 
    isLoading, 
    updateNotificationPreference 
  } = useNotificationSettings();

  // Función para manejar el cambio del switch de notificaciones
  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        // Activar notificaciones
        const { status } = await Notifications.requestPermissionsAsync();
        
        if (status === 'granted') {
          await updateNotificationPreference(true);
          
          // Mostrar confirmación
          Alert.alert(
            '✅ Notificaciones Activadas',
            'Ahora recibirás notificaciones push de la aplicación',
            [{ text: 'Perfecto' }]
          );
        } else {
          // Si no se concedieron permisos, mostrar instrucciones
          Alert.alert(
            '❌ Permisos Denegados',
            'Para recibir notificaciones, debes habilitar los permisos en la configuración de tu dispositivo.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Ir a Configuración', 
                onPress: () => {
                  // En iOS, abrir configuración de la app
                  if (Platform.OS === 'ios') {
                    // Esto abrirá la configuración de la app en iOS
                    // Nota: En iOS no podemos abrir directamente la configuración
                    Alert.alert(
                      'Configuración de iOS',
                      'Ve a Configuración > Veciapp > Notificaciones y habilita las notificaciones'
                    );
                  }
                }
              }
            ]
          );
        }
      } else {
        // Desactivar notificaciones
        await updateNotificationPreference(false);
        
        // Mostrar confirmación
        Alert.alert(
          '🔕 Notificaciones Desactivadas',
          'Ya no recibirás notificaciones push. Puedes reactivarlas en cualquier momento.',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      console.error('Error al cambiar estado de notificaciones:', error);
      Alert.alert(
        '❌ Error',
        'Hubo un problema al cambiar la configuración de notificaciones. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };
  return (
    <>
      <SafeAreaView>
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerTitle: "Mi Cuenta",
            headerTitleAlign: "center",
            headerShown: true,
            headerBackVisible: true,
          }}
        />
        <ScrollView
          className="h-full w-full p-4 bg-white"
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Tarjeta de perfil */}
          <Card className="mb-6 pt-8 rounded-3xl">
            <CardContent>
              <View className="flex-col items-center justify-center gap-2">
                <Avatar className="h-20 w-20" alt="avatar">
                  <AvatarImage source={{ uri: "https://picsum.photos/200" }} />
                  <AvatarFallback>
                    <Text>JS</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="items-center gap-1 mt-2">
                  <Text className="text-xl font-semibold">{fullName}</Text>
                  <Text className="text-muted-foreground">{email}</Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <MapPin size={14} color="#ef4444" />
                    <Text className="text-muted-foreground">
                      {parsedAddress?.address || ""}
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Botones principales */}
          <View className="flex-row justify-between mb-8 px-1">
            <View className="flex-1 items-center mx-1">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/cart")}
                className="w-[90px] h-[90px] bg-green-200 rounded-2xl items-center justify-center"
              >
                <PackageOpen size={40} color="#16a34a" />
              </TouchableOpacity>
              <Text className="text-base font-medium text-black mt-2">
                Pedidos
              </Text>
            </View>
            <View className="flex-1 items-center mx-1">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/home")}
                className="w-[90px] h-[90px] bg-pink-200 rounded-2xl items-center justify-center"
              >
                <Headphones size={40} color="#db2777" />
              </TouchableOpacity>
              <Text className="text-base font-medium text-black mt-2">
                Ayuda
              </Text>
            </View>
          </View>

          {/* Lista de opciones */}
          <View className="gap-2">
            {/* Perfil */}
            <Button
              className="w-full flex-row items-center justify-between"
              variant="ghost"
              onPress={() => router.push("/(customerscreens)/locationSettings")}
            >
              <View className="flex-row items-center gap-2">
                <MapPin className="h-5 w-5 mr-3" color="#000000" />
                <Text>Direcciones</Text>
              </View>
              <ChevronRight className="h-5 w-5" color="#000000" />
            </Button>
            <Separator />

            {/* Historial */}
            <Button
              className="w-full flex-row items-center justify-between"
              variant="ghost"
              onPress={() =>
                router.push("/(customerscreens)/orderHistoryScreen")
              }
            >
              <View className="flex-row items-center gap-2">
                <TimerReset className="h-5 w-5 mr-3" color="#000000" />
                <Text>Historial</Text>
              </View>
              <ChevronRight className="h-5 w-5" color="#000000" />
            </Button>
            <Separator />

            {/* Notificaciones Push */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-transparent">
              <View className="flex-row items-center gap-2">
                <Bell className="h-5 w-5 mr-3" color={notificationsEnabled ? "#16a34a" : "#6b7280"} />
                <View>
                  <Text className={notificationsEnabled ? "text-green-700" : "text-gray-500"}>
                    Notificaciones Push
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {notificationsEnabled ? "Activadas" : "Desactivadas"}
                  </Text>
                </View>
              </View>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleNotificationToggle}
                disabled={isLoading}
              />
            </View>
            <Separator />

            {/* Nosotros */}
            <Button
              className="w-full flex-row items-center justify-between"
              variant="ghost"
              onPress={() => router.push("/aboutUsScreen")}
            >
              <View className="flex-row items-center gap-2">
                <Users className="h-5 w-5 mr-3" color="#000000" />
                <Text>Nosotros</Text>
              </View>
              <ChevronRight className="h-5 w-5" color="#000000" />
            </Button>
            <Separator />

            {/* Preguntas frecuentes */}
            <Button
              className="w-full flex-row items-center justify-between"
              variant="ghost"
              onPress={() =>
                router.push("/(vendorscreens)/(vendorsettings)/faqScreen")
              }
            >
              <View className="flex-row items-center gap-2">
                <MessageCircleQuestion
                  className="h-5 w-5 mr-3"
                  color="#000000"
                />
                <Text>Preguntas frecuentes</Text>
              </View>
              <ChevronRight className="h-5 w-5" color="#000000" />
            </Button>
            <Separator />

            {/* Seguridad */}
            <Button
              className="w-full flex-row items-center justify-between"
              variant="ghost"
              onPress={() => router.push("/(customerscreens)/securitySettings")}
            >
              <View className="flex-row items-center gap-2">
                <UserCircle className="h-5 w-5 mr-3" color="#000000" />
                <Text>Seguridad</Text>
              </View>
              <ChevronRight className="h-5 w-5" color="#000000" />
            </Button>
            <Separator />

            {/* Cerrar Sesión */}
            <Button
              className="w-full flex-row items-center justify-between"
              variant="ghost"
              onPress={async () => {
                try {
                  await logOut.mutateAsync({});
                } catch (error) {
                  console.error(error);
                } finally {
                  clearAllInfoFromLocalStorage();
                  router.dismissTo("/");
                }
              }}
            >
              <View className="flex-row items-center gap-2">
                <UserX className="h-5 w-5 mr-3" color="#000000" />
                <Text>Cerrar Sesión</Text>
              </View>
              <ChevronRight className="h-5 w-5" color="#000000" />
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
