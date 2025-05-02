import { View } from "react-native";
import { Text } from "~/components/ui/text";
import HeaderHome from "../../components/epic/headerHome";
import CategoriesHome from "~/components/epic/categoriesHome";
import PromoCard from "~/components/epic/promoCard";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import ColumnCards from "~/components/epic/columnCards";

export default function HomeScreen() {
  const router = useRouter();

  const sampleProducts = [
    {
      id: '1',
      title: 'Smartphone XYZ',
      price: 599.99,
      distance: '1.2km',
      rating: 4.5,
      category: 'Electrónicos',
      imageUrl: 'https://picsum.photos/200',
      discount: 15
    },
    {
      id: '2',
      title: 'Auriculares Bluetooth',
      price: 89.99,
      distance: '0.8km',
      rating: 4.8,
      category: 'Accesorios',
      imageUrl: 'https://picsum.photos/201',
      discount: 10
    },
    {
      id: '3',
      title: 'Smartwatch Pro',
      price: 299.99,
      distance: '2.1km',
      rating: 4.2,
      category: 'Tecnología',
      imageUrl: 'https://picsum.photos/202'
    },
    {
      id: '3',
      title: 'Arepas con queso',
      price: 299.99,
      distance: '2.1km',
      rating: 4.2,
      category: 'Tecnología',
      imageUrl: 'https://picsum.photos/202'
    },
  ];

  return (
    <ScrollView className="h-full w-full p-4 mt-12">
      <HeaderHome />
      <PromoCard
        title="¡Oferta del día!"
        subtitle="Solo por hoy"
        buttonText="Aprovecha de una"
        image="https://picsum.photos/200"
        onPress={() => { router.push("/(client)/cart") }}
      />
      <CategoriesHome />
      <View className="mt-4">
        <Text className="text-2xl font-bold">Recomendados</Text>
        <Text className="text-2xl font-bold mb-4">Para ti</Text>
        <ColumnCards 
          products={sampleProducts}
          onProductPress={(product) => {
            // Handle product selection
            console.log('Selected product:', product);
          }}
        />
      </View>
    </ScrollView>
  );
}
