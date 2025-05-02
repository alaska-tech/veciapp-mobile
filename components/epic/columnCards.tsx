import { View, ScrollView } from 'react-native';
import ProductCard from './productCard';

interface Product {
  id: string;
  title: string;
  price: number;
  distance: string;
  rating?: number;
  category: string;
  imageUrl: string;
  discount?: number;
}

interface ColumnCardsProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export default function ColumnCards({ products, onProductPress }: ColumnCardsProps) {
  const leftColumnProducts = products.filter((_, index) => index % 2 === 0);
  const rightColumnProducts = products.filter((_, index) => index % 2 !== 0);

  return (
    <ScrollView>
      <View className="flex-row px-2 gap-2">
        {/* Left Column */}
        <View className="flex-1">
          {leftColumnProducts.map((product) => (
            <View key={product.id} className="mb-4">
              <ProductCard
                title={product.title}
                price={product.price}
                distance={product.distance}
                rating={product.rating}
                category={product.category}
                imageUrl={product.imageUrl}
                discount={product.discount}
                onPress={() => onProductPress?.(product)}
              />
            </View>
          ))}
        </View>

        {/* Right Column */}
        <View className="flex-1">
          {rightColumnProducts.map((product) => (
            <View key={product.id} className="mb-4">
              <ProductCard
                title={product.title}
                price={product.price}
                distance={product.distance}
                rating={product.rating}
                category={product.category}
                imageUrl={product.imageUrl}
                discount={product.discount}
                onPress={() => onProductPress?.(product)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}