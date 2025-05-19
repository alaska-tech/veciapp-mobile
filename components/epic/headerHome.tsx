import { View, TouchableOpacity } from 'react-native';
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { MapPinIcon, ShoppingCartIcon, Search } from 'lucide-react-native';
import { Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCartItemsCount } from '~/store/cartStore';

export default function HeaderHome() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  
  // Usar el hook selector especializado que observa cambios en la cantidad total
  const cartItemsCount = useCartItemsCount();

  return (
    <View className='mb-6'>
      {/* Search Bar and Cart */}
      <View className="mb-4 flex-row items-center">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center rounded-lg relative">
            <Input
              placeholder="Busca empanadas para hoy"
              className="flex-1 py-3 text-base pl-12 rounded-full border border-gray-400"
              value={searchText}
              onChangeText={setSearchText}
            />
            {!searchText && (
              <View className="absolute left-3 top-3">
                <Search size={20} color="#666"/>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity 
          activeOpacity={0.3}
          className="rounded-xl p-2"
          onPress={() => router.push('/cart')}
        >
          <ShoppingCartIcon size={22} color="#666"/>
          {cartItemsCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Section */}
      <View className="flex-row items-center">
        <MapPinIcon size={20} color="#ffffff" fill="#666"/>
        <Text 
          className="text-gray-500 text-md pr-1"
        >
          Enviar a
        </Text>
        <Text 
          className="text-gray-500 text-md font-bold flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Calle 123 St 45 # 65 - 123 barrio la esmeralda donde chepito
        </Text>
      </View>
    </View>
  );
}