import React from 'react';
import { View } from 'react-native';
import { Loader } from '~/components/ui/loader';
import { Text } from '~/components/ui/text';

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-[#222] items-center justify-center">
      <View className="items-center justify-center flex-1 w-full">
        <Loader color="#FFD600" />
      </View>
    </View>
  );
} 