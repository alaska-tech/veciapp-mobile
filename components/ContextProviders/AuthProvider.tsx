import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { Customer, CustomerRoleType, User } from "~/constants/models";
import {
  getToken,
  getUserInfo,
  isTokenValid,
  clearAllInfoFromLocalStorage,
  useLocalStorageAction,
} from "~/actions/localStorage.actions";
import useCustomerAction from "~/actions/customer.action";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: User | null;
  customer: Customer | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<CustomerRoleType[number] | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const router = useRouter();
  const currentRoute = usePathname();
  const localStorageActions = useLocalStorageAction();
  const { fetchCustomerDetailsFunction } = useCustomerAction();
  useEffect(() => {
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
        console.log("Stored user:", storedUser);
        console.log("Stored role:", storedRole);
        //if (storedRole === "customer") {
          const customerDetails = await fetchCustomerDetailsFunction(
            storedUser.id
            
          );
          console.log("Customer details:", customerDetails);
          setCustomer(customerDetails.data);
        //}
        setIsAuthenticated(!!token);
        setUserRole(storedRole);
        setUser(storedUser);
        if (storedRole === "customer") {
          router.replace("/(client)/(tabs)/home");
          return;
        }
        if (storedRole === "vendor") {
          router.replace("/(vendor)/vendorHome");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", JSON.stringify(error));
      } finally {
        setLoading(false);
      }
    }

    checkIfThereIsValidStoredJwt();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, loading, user, customer }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
