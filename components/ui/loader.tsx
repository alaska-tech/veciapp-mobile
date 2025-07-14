import { ActivityIndicator, View } from 'react-native';

export function Loader({ color = '#000000' }: { color?: string }) {
  return (
    <View className="flex-1 items-center justify-center p-2">
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}