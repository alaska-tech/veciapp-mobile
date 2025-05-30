import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { addJWTInterceptor } from "~/services/axios.interceptor";
import { apiClient } from "~/services/clients";
import { useRouter } from "expo-router";
import { AuthProvider } from "~/components/ContextProviders/AuthProvider";
import { ParametersProvider } from "~/components/ContextProviders/ParametersProvider";

SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
//SplashScreen.setOptions({
// duration: 2000,
// fade: true,
//});

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const queryClient = new QueryClient();
  const router = useRouter();
  addJWTInterceptor(apiClient);
  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }

        await setAndroidNavigationBar(isDarkColorScheme ? "dark" : "light");
        //await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsColorSchemeLoaded(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isColorSchemeLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isColorSchemeLoaded]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ParametersProvider>
            <ThemeProvider value={LIGHT_THEME}>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
              <PortalHost />
            </ThemeProvider>
          </ParametersProvider>
        </AuthProvider>
      </QueryClientProvider>
    </View>
  );
}
