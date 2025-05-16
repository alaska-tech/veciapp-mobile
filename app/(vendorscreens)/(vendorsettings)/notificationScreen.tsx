import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Stack } from 'expo-router';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';

export default function NotificationScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Notificaciones",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackTitle: "Volver",
          headerBackVisible: true,
        }}
      />
      <ScrollView className="h-full w-full p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base">Notificaciones push</Text>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-base">Notificaciones por correo</Text>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </>
  );
}
