import { View, TouchableOpacity } from 'react-native';
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { MapPinIcon, ShoppingCartIcon, Search } from 'lucide-react-native';
import { Image } from 'react-native';
import { useState } from 'react';

export default function HeaderHome() {
  const [searchText, setSearchText] = useState('');

  return (
    <View className='mb-6'>
      {/* Logo and Icons */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="w-10 h-10 flex items-center justify-center">
          <Image 
            source={require('../../assets/images/logo.png')}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity 
            activeOpacity={0.3}
            className="rounded-xl p-2"
          >
            <ShoppingCartIcon size={22} color="#666"/>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mb-5">
        <View className="flex-row items-center rounded-lg relative">
          <Input
            placeholder="Encuentra lo que necesitas..."
            className="flex-1 py-3 text-base pl-12 rounded-full shadow-md"
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

      {/* Profile and Location Container */}
      <View className="flex-row items-center justify-between">
        {/* Profile Section */}
        <View className="flex-row items-center max-w-[150px] gap-2 bg-gray-100 py-2 px-3 rounded-full">
          <Image 
            source={require('../../assets/images/profile.png')}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
          <Text className="text-gray-700 font-medium flex-1" numberOfLines={1}>
            Hombre Peneeeeeeeeee
          </Text>
        </View>

        {/* Location Section */}
        <View className="flex-row items-center flex-1 ml-2">
          <MapPinIcon size={20} color="#ffffff" fill="#666"/>
          <Text 
            className="text-gray-500 text-md pr-1"
          >
            Enviar a
          </Text>
          <Text 
            className="text-gray-500 text-md font-bold"
            numberOfLines={1}
          >
            Calle 123 St 45 # 65 Sta Marta, Calle25...
          </Text>
        </View>
      </View>
    </View>
  );
}