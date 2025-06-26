import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import useAuthAction from "~/actions/auth.action";
import { JWT_KEY, LOGGED_USER_INFO_KEY } from "~/constants/constants";
import { User } from "~/constants/models";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  user: User | null;
  logIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  user: null,
  logIn: async () => {},
  logOut: async () => {},
});
const ALLOWED_ROLES = ["customer", "vendor"];
export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const authActions = useAuthAction();
  const loginMutation = authActions.logIn();
  const logoutMutation = authActions.logOut();

  const storeAuthState = async ({ user, jwt }: { user: User; jwt: string }) => {
    try {
      await AsyncStorage.setItem(JWT_KEY, jwt);
      await AsyncStorage.setItem(LOGGED_USER_INFO_KEY, JSON.stringify(user));
    } catch (error) {
      console.log("Error saving", error);
    }
  };
  const getAuthState = async (): Promise<{
    user: User | null;
    jwt: string;
  }> => {
    try {
      const jwt = await AsyncStorage.getItem(JWT_KEY);
      const user = await AsyncStorage.getItem(LOGGED_USER_INFO_KEY);
      if (!jwt || !user) {
        return { jwt: "", user: null };
      }
      return { jwt, user: JSON.parse(user) };
    } catch (error) {
      console.log("Error saving", error);
      return { jwt: "", user: null };
    }
  };
  const clearAuthState = async () => {
    try {
      await AsyncStorage.removeItem(JWT_KEY);
      await AsyncStorage.removeItem(LOGGED_USER_INFO_KEY);
    } catch (error) {
      console.log("Error removing", error);
    }
  };

  const logIn = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    return loginMutation
      .mutateAsync({
        body: { email, password },
      })
      .then(
        (res) => {
          const { token, user } = res.data.data;
          if (!ALLOWED_ROLES.includes(user.role)) {
            throw new Error("Unauthorized role");
          }
          storeAuthState({ user, jwt: token });
          setIsLoggedIn(true);
          setUser(user);
          setIsReady(true);
          if (user.role === "customer") {
            router.dismissTo("/(client)/home");
          } else if (user.role === "vendor") {
            router.dismissTo("/(vendor)/vendorHome");
          }
        },
        () => {}
      );
  };

  const logOut = async () => {
    await logoutMutation
      .mutateAsync({
        body: null,
      })
      .finally(() => {
        clearAuthState();
        setIsLoggedIn(false);
        setUser(null);
        setIsReady(true);
        router.dismissTo("/");
      });
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      // simulate a delay, e.g. for an API request
      await new Promise((res) => setTimeout(() => res(null), 1000));
      try {
        const { jwt, user } = await getAuthState();
        if (!user) {
          clearAuthState();
          setIsLoggedIn(false);
          setUser(null);
          setIsReady(true);
          router.dismissTo("/");
          return;
        }

        if (!ALLOWED_ROLES.includes(user.role)) {
          clearAuthState();
          setIsLoggedIn(false);
          setUser(null);
          setIsReady(true);
          router.dismissTo("/");
          return;
        } else {
          setIsLoggedIn(true);
          setUser(user);
          setIsReady(true);
          if (user.role === "customer") {
            router.dismissTo("/(client)/home");
          } else if (user.role === "vendor") {
            router.dismissTo("/(vendor)/vendorHome");
          }
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        logIn,
        logOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
