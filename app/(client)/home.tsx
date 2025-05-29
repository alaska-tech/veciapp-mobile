import { View } from "react-native";
import { Text } from "~/components/ui/text";
import HeaderHome from "../../components/epic/headerHome";
import CategoriesHome from "~/components/epic/categoriesHome";
import ImageCarousel from "~/components/epic/imageCarousel";
import Veciproveedores from "~/components/epic/veciproveedores";
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

  const sampleProveedores = [
    {
      id: '1',
      name: 'Super Tienda',
      imageUrl: 'https://picsum.photos/200',
    },
    {
      id: '2',
      name: 'Terribol Mascotas',
      imageUrl: 'https://picsum.photos/201',
    },
    {
      id: '3',
      name: 'Belleza & Estilo',
      imageUrl: 'https://picsum.photos/202',
    },
    {
      id: '4',
      name: 'Moda Express',
      imageUrl: 'https://picsum.photos/203',
    },
    {
      id: '5',
      name: 'Frutas & Verduras',
      imageUrl: 'https://picsum.photos/204',
    },
    {
      id: '6',
      name: 'Tech Gadgets',
      imageUrl: 'https://picsum.photos/205',
    },
    {
      id: '7',
      name: 'Artesanías',
      imageUrl: 'https://picsum.photos/206',
    }
  ];

  return (
    <ScrollView className="h-full w-full p-4 mt-14">
      <HeaderHome />
      <ImageCarousel />
      <Veciproveedores 
        proveedores={sampleProveedores}
        onSeeAllPress={() => {
          console.log('Ver todos pressed');
          // Navigate to all providers screen
          router.push('/(customerscreens)/allVendorsScreen');
        }}
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
