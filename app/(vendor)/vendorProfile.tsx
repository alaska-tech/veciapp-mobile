import { ScrollView, View, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Bell,
  LogOut,
  ChevronRight,
  Package,
  CreditCard,
  History,
  User,
  MapPin,
  BadgeDollarSign,
  Headset,
  MessageCircleQuestion,
} from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Switch } from "~/components/ui/switch";
import React, { useState } from "react";

export default function VendorProfileScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  
  const handleSendEmail = () => {
    Linking.openURL('mailto:veciapp@maleua.org');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Mi Cuenta",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
      <ScrollView className="h-full w-full p-4 bg-white">
        <Card className="mb-6 pt-8 rounded-3xl">
          <CardContent>
            <View className="flex-col items-center justify-center gap-2">
              <Avatar alt="avatar" className="h-20 w-20">
                <AvatarImage source={{ uri: "https://picsum.photos/200" }} />
                <AvatarFallback>
                  <Text>VS</Text>
                </AvatarFallback>
              </Avatar>
              <View className="items-center gap-1">
                <Text className="text-xl font-semibold">Laura Riascos</Text>
                <Text className="text-muted-foreground">
                  laura.lopez@example.com
                </Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MapPin size={14} color="#000000" />
                  <Text className="text-muted-foreground">
                    Calle 22 #3-45, Centro Histórico
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Botones principales */}
        <View className="flex-row justify-between mb-8"> 
          <View className="flex-1 items-center mx-1">
            <TouchableOpacity 
              className="w-[72px] h-[72px] bg-[#DD6F9C] rounded-2xl items-center justify-center"
              onPress={handleSendEmail}
            >
              <Headset size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-sm font-medium text-black mt-2">Ayuda</Text>
          </View>
          
          <View className="flex-1 items-center mx-1">
            <TouchableOpacity 
              className="w-[72px] h-[72px] bg-[#9747FF] rounded-2xl items-center justify-center"
            >
              <BadgeDollarSign size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-sm font-medium text-black mt-2">Mis Ofertas</Text>
          </View>
        </View>

        {/* Opciones de perfil */}
        <View className="gap-2">
          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
            onPress={() => router.push("/(vendorscreens)/(vendorsettings)/profileSettingScreen")}
          >
            <View className="flex-row items-center gap-2">
              <User className="h-5 w-5 mr-3" color="#000000" />
              <Text>Editar Perfil</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>
          <Separator />
          
          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
          >
            <View className="flex-row items-center gap-2">
              <Bell className="h-5 w-5 mr-3" color="#000000" />
              <Text>Notificaciones Push</Text>
            </View>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </Button>
          <Separator />

          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
            onPress={() => router.push("/(vendorscreens)/(vendorsettings)/faqScreen")}
          >
            <View className="flex-row items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5 mr-3" color="#000000" />
              <Text>Preguntas Frecuentes</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>
          <Separator />

          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
            onPress={() => router.push("/orders?tab=historial")}
          >
            <View className="flex-row items-center gap-2">
              <History className="h-5 w-5 mr-3" color="#000000" />
              <Text>Historial de Pedidos</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>
          <Separator />

          <Button
            className="w-full flex-row items-center justify-between"
            variant="ghost"
          >
            <View className="flex-row items-center gap-2">
              <LogOut className="h-5 w-5 mr-3" color="#000000" />
              <Text>Cerrar Sesión</Text>
            </View>
            <ChevronRight className="h-5 w-5" color="#000000" />
          </Button>
        </View>
      </ScrollView>
    </>
  );
}