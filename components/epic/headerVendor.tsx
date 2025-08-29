import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Bell, SquareMousePointer } from "lucide-react-native";
import { Image } from "react-native";
import { Branch, Customer, Vendor } from "~/constants/models";

export default function HeaderHome({
  user,
  branch,
  onBranchPress,
}: {
  user: Vendor | Customer;
  branch?: Branch;
  onBranchPress?: () => void;
}) {
  return (
    <View className="px-4 pt-4">
      {/* Logo and Icons */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center max-w-[160px] gap-2 bg-gray-100 py-2 px-3 rounded-full">
          <Image
            source={{ uri: user?.avatar }}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
          <Text className="text-gray-700 font-medium flex-1" numberOfLines={1}>
            Hola,{" "}
            <Text className="text-gray-700 font-bold flex-1" numberOfLines={1}>
              {user?.fullName}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center max-w-[200px] gap-2 bg-gray-100 py-2 px-3 rounded-full"
          onPress={onBranchPress}
        >
          <Image
            source={{ uri: branch?.logo }}
            className="w-8 h-8 rounded-full"
            resizeMode="cover"
          />
          <Text className="text-gray-700 font-medium flex-1" numberOfLines={1}>
            {branch?.name} {branch?.address}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
