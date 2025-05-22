import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity, Image, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { ScrollView } from 'react-native';

const categories = [
  {
    title: 'Belleza',
    description: 'Cuidado personal y cosmética.',
    color: 'bg-pink-400',
    image: require('../../assets/images/Belleza.png'),
  },
  {
    title: 'Confecciones',
    description: 'Ropa y accesorios.',
    color: 'bg-orange-400',
    image: require('../../assets/images/Confecciones.png'),
  },
  {
    title: 'Gastronomía',
    description: 'Comida y bebidas.',
    color: 'bg-amber-900',
    image: require('../../assets/images/Gastronomía.png'),
  },
];

export default function CustomerCategories() {
  return (
    <>
      <Stack.Screen options={{
        title: 'Categorías',
        headerShown: true,
        headerTitleAlign: 'center',
        headerBackTitle: "Volver",
      }} />
      <View className="flex-1 bg-white">
        <View className="h-px bg-gray-200 mb-3" />
        <ScrollView contentContainerStyle={{}} className="px-4 pb-8 mt-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.title}
              activeOpacity={0.85}
              className={`${cat.color} flex-row items-center rounded-2xl mb-5 p-4 shadow`}
              // onPress={() => {}}
            >
              <View className="flex-1">
                <Text className="text-white text-xl font-bold mb-1">{cat.title}</Text>
                <Text className="text-white text-base">{cat.description}</Text>
              </View>
              <Image source={cat.image} className="w-16 h-16 ml-4 rounded-lg bg-white/10" resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
