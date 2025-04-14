import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import ProductCard from '~/components/epic/productCard';

// Define the product interface
interface Product {
  title: string;
  rating: number;
  price: number;
  distance: string;
  category: string;
  imageUrl: any; // Using 'any' for image require, you could use a more specific type if available
  discount: number;
}

export default function InfiniteScrollHome() {
  // Sample data for products
  const products: Product[] = [
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
    {
      title: "Pantalón de mezclilla",
      rating: 4.3,
      price: 12000,
      distance: "1.5km",
      category: "Ropa",
      imageUrl: require('../../assets/images/food.png'),
      discount: 0,
    },
    {
      title: "Camiseta de mezclilla",
      rating: 4.9,
      price: 12000,
      distance: "1.5km",
      category: "Ropa",
      imageUrl: require('../../assets/images/food.png'),
      discount: 0,
    },
    // Add more sample products as needed
  ];

  // Dividir los productos en dos arrays
  const leftColumnProducts = products.filter((_, index) => index % 2 === 0);
  const rightColumnProducts = products.filter((_, index) => index % 2 === 1);

  const renderProductCard = (product: Product, index: number, isRightColumn: boolean = false) => {
    return (
      <View 
        key={`${isRightColumn ? 'right' : 'left'}-${index}`} 
        className="mb-4"
      >
        <ProductCard
          title={product.title}
          rating={product.rating}
          price={product.price}
          distance={product.distance}
          category={product.category}
          imageUrl={product.imageUrl}
          discount={product.discount}
          onPress={() => {
            console.log(`Producto seleccionado: ${product.title}`);
          }}
        />
      </View>
    );
  };

  return (
    <View className="flex-1">
      <View className="mb-4">
        <Text className="text-3xl font-bold mb-1">Recomendados</Text>
        <Text className="text-3xl font-bold">para ti</Text>
      </View>
      
      <View className="flex-row w-full">
        {/* Left Column */}
        <View className="w-1/2 pr-2">
          {leftColumnProducts.map((product, index) => 
            renderProductCard(product, index, false)
          )}
        </View>
        
        {/* Right Column */}
        <View className="w-1/2 pl-2 mt-8">
          {rightColumnProducts.map((product, index) => 
            renderProductCard(product, index, true)
          )}
        </View>
      </View>
    </View>
  );
}