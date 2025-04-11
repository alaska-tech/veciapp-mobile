import { ActivityIndicator, View } from 'react-native';

export function Loader() {
  return (
    <View className="flex-1 items-center justify-center p-2">
      <ActivityIndicator size="large" color="#000000" />
    </View>
  );
}