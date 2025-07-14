import React, { useEffect, useState } from 'react';
import { View, Image, TextInput, ScrollView } from 'react-native';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';

export default function PaymentResultScreen() {
  const router = useRouter();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 min-h-screen items-center justify-center px-4">
        <Text className="text-3xl font-bold text-green-900 text-center mb-6">¡Listo, tu compra fue un éxito!</Text>
        <Card className="w-full max-w-xl mb-8 bg-white rounded-2xl shadow-lg">
          <View className="p-6">
            <Text className="text-lg font-bold mb-4 text-center">¿Qué te pareció la compra?</Text>
            <View className="flex-row items-center justify-center mb-2">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=80&q=80' }} className="w-8 h-8 rounded-full mr-2" />
              <Text className="text-base font-medium">Jabon artesanal coco y miel</Text>
            </View>
            <View className="flex-row items-center justify-center mb-2 mt-2">
              {[1,2,3,4,5].map((i) => (
                <Text key={i} className="text-4xl mx-1" style={{ color: '#FFD600' }}>★</Text>
              ))}
            </View>
            <View className="flex-row justify-between px-2 mb-2">
              <Text className="text-xs text-gray-500">Malo</Text>
              <Text className="text-xs text-gray-500">Excelente</Text>
            </View>
            <Text className="text-sm font-semibold mb-1">Cuéntanos acerca de tu experiencia <Text className="text-xs text-gray-400">(Opcional)</Text></Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-2 text-base bg-gray-50 mb-2"
              placeholder="¿Qué te pareció el producto que compraste?"
              maxLength={1500}
              multiline
              numberOfLines={3}
              style={{ minHeight: 60 }}
            />
            <Text className="text-xs text-gray-400 text-right">0/1500</Text>
          </View>
        </Card>
        <View className="w-full max-w-xl mb-4">
          <View className="bg-black rounded-2xl py-5 mb-4">
            <Text className="text-white text-center text-lg font-semibold">Gracias por ser parte del vecindario</Text>
          </View>
          <View className="bg-white rounded-2xl py-5 mb-4 items-center">
            <Text className="text-center text-base mb-2">En <Text className="font-bold">{counter} segundos</Text> seras redirigido al chat con tu veciproveedor</Text>
          </View>
          <Button
            className="w-full bg-yellow-400 rounded-full py-4"
            onPress={() => router.replace('/(client)/(tabs)/home')}
          >
            <Text className="text-black text-center font-semibold text-lg">Coordinar entrega ahora</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
} 