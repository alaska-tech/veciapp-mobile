import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Stack } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

type FAQItem = {
  question: string;
  answer: string;
  isOpen: boolean;
};

export default function FAQScreen() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: "¿Cómo funciona la recogida de productos si no ofrecen domicilios?",
      answer: "pueden seleccionar sus productos en la app y escoger una franja horaria para recogerlos directamente en el establecimiento del vendedor. Una vez confirmada la compra, recibirán un código de recogida que deberán mostrar al llegar.",
      isOpen: false
    },
    {
      question: "¿Qué negocios están disponibles?",
      answer: "Nuestra app incluye artesanos locales, pequeños comerciantes, restaurantes tradicionales, tiendas de productos típicos y emprendimientos de Santa Marta que contribuyen directamente a la economía local.",
      isOpen: false
    },
    {
      question: "¿Cómo apoyan a la comunidad?",
      answer: "Trabajamos exclusivamente con emprendedores de Santa Marta, ofrecemos comisiones bajas, organizamos eventos promocionales y reinvertimos en programas de capacitación digital para comerciantes locales.",
      isOpen: false
    },
    {
      question: "¿Qué pagos aceptan?",
      answer: "Aceptamos tarjetas de crédito, débito, transferencias bancarias y efectivo al recoger el producto. También aceptamos billeteras digitales como Nequi y Daviplata",
      isOpen: false
    },
    {
      question: "¿Tienen programa de puntos?",
      answer: "Sí, nuestro programa buenos vecinos, permite acumular puntos por cada compra y canjearlos por descuentos en futuras compras o productos exclusivos de nuestros comercios asociados.",
      isOpen: false
    }
  ]);

  const toggleFAQ = (index: number) => {
    setFaqItems(faqItems.map((item, i) => 
      i === index ? { ...item, isOpen: !item.isOpen } : item
    ));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Preguntas frecuentes",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />
      <ScrollView className="h-full w-full mt-4 px-4">
        {faqItems.map((item, index) => (
          <View key={index} className="border border-gray-200 rounded-lg mb-3">
            <TouchableOpacity 
              onPress={() => toggleFAQ(index)}
              className="flex-row justify-between items-center p-4"
            >
              <Text className="text-lg font-medium flex-1">{item.question}</Text>
              {item.isOpen ? 
                <ChevronUp size={24} color="#000" /> : 
                <ChevronDown size={24} color="#000" />
              }
            </TouchableOpacity>
            {item.isOpen && (
              <View className="p-4 bg-gray-100 rounded-b-lg">
                <Text className="text-base text-gray-700">{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
}
