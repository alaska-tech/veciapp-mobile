import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';

export default function DashboardWebView() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ 
        title: "Administración",
        headerBackTitle: "Volver a App",
        headerShown: true,
        headerTitleAlign: "center"
      }} />
      <WebView 
        source={{ uri: 'https://www.adminveciapp.com.co/' }}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
}