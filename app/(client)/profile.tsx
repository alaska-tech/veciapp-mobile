import { ScrollView, View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Bell,
  UserCircle,
  Lock,
  ChevronRight,
  TimerReset,
  UserX,
  PackageOpen,
  Headphones,
} from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { Card, CardContent } from "~/components/ui/card";
import { TouchableOpacity } from "react-native";
import useAuthAction from "~/actions/auth.action";
import { clearAllInfoFromLocalStorage } from "~/actions/localStorage.actions";

export default function ProfileScreen() {
  const router = useRouter();
  const authActions = useAuthAction();
  const logOut = authActions.logOut();
  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Mi Cuenta",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView className="h-full w-full p-4">
        <Card className="mb-6 pt-8 rounded-3xl">
          <CardContent>
            <View className="flex-col items-center justify-center gap-2">
              <Avatar className="h-20 w-20" alt="avatar">
                <AvatarImage source={{ uri: "https://picsum.photos/200" }} />
                <AvatarFallback>
                  <Text>JS</Text>
                </AvatarFallback>
              </Avatar>
              <View className="items-center gap-1">
                <Text className="text-xl font-semibold">JuanchoSM</Text>
                <Text className="text-muted-foreground">
                  juancho.santamarta@example.com
                </Text>
                <Text className="text-muted-foreground">
                  Calle 22 #3-45, Centro Histórico
                </Text>
              </View>
            </View>

            <Button
              className="w-full flex-row items-center mt-4 bg-yellow-400 rounded-full gap-2"
              size="lg"
            >
              <Bell className="h-2 w-2" color="#000" />
              <Text className="text-black text-xl">Notificaciones</Text>
            </Button>
          </CardContent>
        </Card>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-6 px-1"
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/cart")}
            className="flex-1 mr-4"
          >
            <Card className="overflow-hidden bg-green-100 rounded-3xl">
              <CardContent className="p-4 items-center">
                <View className="w-32 aspect-square rounded-full bg-green-200 items-center justify-center mb-3">
                  <PackageOpen className="h-16 w-16" color="#16a34a" />
                </View>
              </CardContent>
            </Card>
            <Text className="text-xl font-medium text-center pt-2">
              Pedidos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/home")}
            className="flex-1"
          >
            <Card className="overflow-hidden bg-pink-100 rounded-3xl">
              <CardContent className="p-4 items-center">
                <View className="w-32 aspect-square rounded-full bg-pink-200 items-center justify-center mb-3">
                  <Headphones className="h-16 w-16" color="#db2777" />
                </View>
              </CardContent>
            </Card>
            <Text className="text-xl font-medium text-center pt-2">Ayuda</Text>
          </TouchableOpacity>
        </ScrollView>

        <View className="gap-4">
          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
          >
            <View className="flex-row items-center gap-2">
              <UserCircle className="h-5 w-5 mr-3" color="#000000" />
              <Text>Perfil</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>

          <Separator />

          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
          >
            <View className="flex-row items-center gap-2">
              <TimerReset className="h-5 w-5 mr-3" color="#000000" />
              <Text>Historial</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>

          <Separator />

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

          <Separator />

          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
          >
            <View className="flex-row items-center gap-2">
              <Lock className="h-5 w-5 mr-3" color="rgb(239 68 68)" />
              <Text className="text-destructive">Eliminar Cuenta</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
