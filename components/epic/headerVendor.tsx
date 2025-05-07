import { View, TouchableOpacity } from 'react-native';
import { Text } from "~/components/ui/text";
import { Bell } from 'lucide-react-native';
import { Image } from 'react-native';


export default function HeaderHome() {

  return (
    <View className='bg-emerald-700 px-4'>
      {/* Logo and Icons */}
      <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center max-w-[160px] gap-2 bg-emerald-500 py-2 px-3 rounded-full">
          <Image 
            source={require('../../assets/images/profile.png')}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
          <Text className="text-gray-700 font-medium flex-1" numberOfLines={1}>
            Hola, <Text className="text-gray-700 font-bold flex-1" numberOfLines={1}>
            Elder
          </Text>
          </Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity 
            activeOpacity={0.3}
            className="rounded-xl p-2"
          >
            <Bell size={22} color="#ffffff" fill="#ffffff"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}