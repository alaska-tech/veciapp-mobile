import { View, TouchableOpacity } from 'react-native';
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { MapPinIcon, ShoppingCartIcon, BellIcon, Search } from 'lucide-react-native';
import { Image } from 'react-native';
import { useState } from 'react';

export default function HeaderHome() {
  const [searchText, setSearchText] = useState('');

  return (
    <View className="p-4">
      {/* Logo and Icons */}
      <View className="mb-2 flex-row items-center justify-between">
        <View className="w-24 h-24 flex items-center justify-center">
          <Image 
            source={require('../../assets/images/veciapplogo2.png')}
            className="w-36 h-34 ml-10"
            resizeMode="contain"
          />
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity 
            activeOpacity={0.3}
            className="border-1 border-gray-500 border rounded-lg p-2"
          >
            <ShoppingCartIcon size={22} color="#666" fill="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.3}
            className="border-1 border-gray-500 border rounded-lg p-2"
          >
            <BellIcon size={22} color="#666" fill="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mb-4">
        <View className="flex-row items-center rounded-lg relative">
          <Input
            placeholder="Encuentra lo que necesitas..."
            className="flex-1 py-3 text-base pl-12"
            value={searchText}
            onChangeText={setSearchText}
          />
          {!searchText && (
            <View className="absolute left-3 top-3">
              <Search size={20} color="#666" />
            </View>
          )}
        </View>
      </View>

      {/* Location */}
      <View className="flex-row items-center gap-2">
        <MapPinIcon size={20} color="#666"/>
        <Text 
          className="text-gray-500 text-md flex-1"
          numberOfLines={1}
        >
          Enviar a Calle 123 St 45 # 65 Sta Marta, Calle25...
        </Text>
      </View>
    </View>
  );
}