import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

const categories = [
  {
    id: 1,
    title: 'Belleza y\nEstética',
    image: require('../../assets/images/beauty.png'),
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600'
  },
  {
    id: 2,
    title: 'Confecciones',
    image: require('../../assets/images/clothing.png'),
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  },
  {
    id: 3,
    title: 'Gastronomía',
    image: require('../../assets/images/food.png'),
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600'
  },
  {
    id: 4,
    title: 'Servicios y\nMantenimiento',
    image: require('../../assets/images/services.png'),
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
];

export default function CategoriesHome() {
  const router = useRouter();
  return (
    <View className="">
      <TouchableOpacity onPress={() => router.push('/(customerscreens)/customerCategories')}>
        <Text className="text-2xl font-bold mb-2">Categorías</Text>
      </TouchableOpacity>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="h-52 p-2"
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            className={`${category.bgColor} rounded-3xl p-3 w-36 h-36 shadow relative mt-8 ${
              index !== categories.length - 1 ? 'mr-4' : ''
            }`}
          >
            <View className="items-center flex-col gap-2">
              <View className="w-24 h-24 rounded-full overflow-hidden absolute -top-8 left-1/2 -translate-x-12">
                <Image
                  source={category.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className={`text-center text-md font-bold ${category.textColor} mt-20`}>
                {category.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}