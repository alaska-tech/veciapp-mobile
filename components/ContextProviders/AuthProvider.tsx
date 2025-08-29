import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { CustomerRoleType, User } from "~/constants/models";
import {
  getToken,
  getUserInfo,
  isTokenValid,
  clearAllInfoFromLocalStorage,
  useLocalStorageAction,
} from "~/actions/localStorage.actions";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: User | null;
  loading: boolean;
  refreshAuthInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<CustomerRoleType[number] | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const currentRoute = usePathname();
  const localStorageActions = useLocalStorageAction();
  function redirectIfUser(role: CustomerRoleType[number]) {
    if (role === "customer") {
      router.replace("/(client)/(tabs)/home");
      return;
    }
    if (role === "vendor") {
      router.replace("/(vendor)/vendorHome");
      return;
    }
  }
  async function checkIfThereIsValidStoredJwt() {
    const token = await getToken();
    if (!token) {
      clearAllInfoFromLocalStorage();
      router.replace("/");
      return;
    }
    const isValid = await isTokenValid();
    if (!isValid) {
      try {
        await localStorageActions.refreshCurrentToken();
      } catch (error) {
        clearAllInfoFromLocalStorage();
        router.replace("/");
      }
    }
    console.log(currentRoute);
    if (currentRoute !== "/") {
      return;
    }
    try {
      const storedUser = await getUserInfo();
      if (!storedUser) {
        return;
      }
      const storedRole = storedUser?.role;
      console.log(storedRole);
      if (!storedRole) {
        return;
      }
      setIsAuthenticated(!!token);
      setUserRole(storedRole);
      setUser(storedUser);
      redirectIfUser(storedRole);
    } catch (error) {
      console.error("Auth check failed:", JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }
  /*   useEffect(() => {

    checkIfThereIsValidStoredJwt();
  }, []); */

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        loading,
        user,
        refreshAuthInfo: checkIfThereIsValidStoredJwt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
