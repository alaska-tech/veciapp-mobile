import "react-native-gesture-handler";
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
import { Platform, View, AppStateStatus } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { focusManager, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { addJWTInterceptor } from "~/services/axios.interceptor";
import { apiClient } from "~/services/clients";
import { AuthProvider } from "~/components/ContextProviders/AuthProvider";
import { ParametersProvider } from "~/components/ContextProviders/ParametersProvider";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Loader } from "~/components/ui/loader";
import { useGlobalLoadingScreen } from "~/store/loadingStore";
import { NetworkErrorDialog } from "~/components/epic/networkErrorDialog";

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

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, gcTime: 1000 * 60 * 60 * 24 } },
});
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

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

  const { isLoading } = useGlobalLoadingScreen();

  //useOnlineManager();
  //useAppState(onAppStateChange);
  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <ParametersProvider>
              <SafeAreaProvider>
                <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
                    {isLoading ? (
                      <View className="absolute inset-0 bg-[#22222279] items-center justify-center z-99999999999999999999999">
                        <View className="items-center justify-center flex-1 w-full">
                          <Loader color="#FFD600" />
                        </View>
                      </View>
                    ) : (
                      <></>
                    )}
                    <NetworkErrorDialog />
                    <PortalHost />
                  </ThemeProvider>
                </View>
              </SafeAreaProvider>
            </ParametersProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}
