import React from "react";
import { View, Image, ScrollView, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Globe, Flag } from "lucide-react-native";
import { Stack } from "expo-router";

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nosotros",
          headerShown: true,
          headerBackTitle: "Volver",
        }}
      />
      <ScrollView className="flex-1 bg-white px-4 pt-4">
        {/* Título y descripción */}
        <Text className="text-3xl font-bold mb-2">Conoce a Maleua</Text>
        <Text className="text-lg mb-4">
          Maleua es un proyecto social que nace con el propósito de fortalecer la economía local y conectar a vecinos con proveedores confiables en su comunidad.
        </Text>
        <Text className="text-lg mb-6">
          A través de VeciApp, buscamos construir redes solidarias donde cada intercambio aporte valor, bienestar y desarrollo para todos.
        </Text>

        {/* Imagen */}
        <Text className="text-lg font-bold mb-2">
          Descubre cómo trabajamos en comunidad.
        </Text>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" }}
          className="w-full h-48 rounded-lg mb-4"
          resizeMode="cover"
        />

        {/* Más información */}
        <Text className="text-base font-semibold mb-2">
          ¿Quieres saber más sobre nosotros?
        </Text>
        <Button
          className="w-full mb-3 flex-row items-center justify-center rounded-full bg-yellow-400 gap-2"
          onPress={() => Linking.openURL("https://www.maleua.org/")}
        >
          <Globe className="mr-2" color="#000" />
          <Text className="text-base font-semibold text-black">Visita nuestro sitio web</Text>
        </Button>
        <Button
          className="w-full flex-row items-center justify-center rounded-full bg-gray-200 gap-2"
          variant="outline"
          onPress={() => router.push('/(onboarding)/onboarding1')}
        >
          <Flag className="mr-2" color="#888888" />
          <Text className="text-base">Ver Onboarding</Text>
        </Button>
      </ScrollView>
    </>
  );
}
