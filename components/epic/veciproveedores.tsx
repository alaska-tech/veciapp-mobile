import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

type Veciproveedor = {
  id: string;
  name: string;
  imageUrl: string;
};

type VeciproveedoresProps = {
  proveedores: Veciproveedor[];
  onSeeAllPress: () => void;
};

export default function Veciproveedores({ proveedores, onSeeAllPress }: VeciproveedoresProps) {
  const router = useRouter();

  return (
    <View className="mt-4">
      <Text className="text-2xl font-bold mb-2">Nuestros Veciproveedores</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="h-40"
      >
        {proveedores.map((proveedor, index) => (
          <TouchableOpacity
            key={proveedor.id}
            className={`items-center justify-center mr-4`}
            onPress={() => {
              console.log(`Selected proveedor: ${proveedor.name}`);
              // Navigate to provider detail or handle as needed
            }}
          >
            <View className="w-24 h-24 rounded-full overflow-hidden mb-2">
              <Image
                source={{ uri: proveedor.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-center text-sm font-medium">
              {proveedor.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* "Ver todos" button */}
        <TouchableOpacity
          className="items-center justify-center ml-2"
          onPress={onSeeAllPress}
        >
          <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-2">
            <Text className="text-2xl font-bold">+</Text>
          </View>
          <Text className="text-center text-sm font-medium">
            Ver todos
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 