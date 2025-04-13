import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import ProductCard from '~/components/epic/productCard';

export default function InfiniteScrollHome() {
  // Sample data for products
  const products = [
    {
      title: "Jabón Artesanal de Coco y Miel",
      rating: 4.2,
      price: 12000,
      distance: "1.5km",
      category: "Belleza y estética",
      imageUrl: require('../../assets/images/food.png'),
      discount: 0,
    },
    {
      title: "Arepas con queso",
      rating: 4.8,
      price: 12000,
      distance: "1.5km",
      category: "Gastronomía",
      imageUrl: require('../../assets/images/food.png'),
      discount: 15,
    },
    {
      title: "Delantal tropical bordado",
      rating: 4.5,
      price: 45000,
      distance: "1.5km",
      category: "Confecciones",
      imageUrl: require('../../assets/images/food.png'),
      discount: 0,
    },
    {
      title: "Empanadas de camarón",
      rating: 4.7,
      price: 22000,
      distance: "1.5km",
      category: "Gastronomía",
      imageUrl: require('../../assets/images/food.png'),
      discount: 0,
    },
    // Add more sample products as needed
  ];

  // Dividir los productos en dos arrays
  const leftColumnProducts = products.filter((_, index) => index % 2 === 0);
  const rightColumnProducts = products.filter((_, index) => index % 2 === 1);

  return (
    <View className="flex-1">
      <Text className="text-3xl font-bold mb-1">Recomendados</Text>
      <Text className="text-3xl font-bold mb-4">para ti</Text>
      
      <View className="flex-row w-full">
        {/* Left Column */}
        <View className="w-1/2 pr-2">
          {leftColumnProducts.map((product, index) => (
            <View key={`left-${index}`} className="mb-4">
              <ProductCard
                {...product}
                onPress={() => {
                  console.log(`Producto seleccionado: ${product.title}`);
                }}
              />
            </View>
          ))}
        </View>

        {/* Right Column */}
        <View className="w-1/2 pl-2 mt-8">
          {rightColumnProducts.map((product, index) => (
            <View key={`right-${index}`} className="mb-4">
              <ProductCard
                {...product}
                onPress={() => {
                    console.log(`Producto seleccionado: ${product.title}`);
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}