import { mutateEntity } from "./action";
import { AxiosError, AxiosResponse } from "axios";
import {
  JWT_KEY,
  LOGGED_USER_INFO_KEY,
  PARAMETERS_KEY,
} from "~/constants/constants";
import { apiClient } from "~/services/clients";
import { User, Response, Parameter } from "~/constants/models";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const MIN_REMAINING_HOURS = 24;

export const getParameters = async (): Promise<Record<
  string,
  Parameter
> | null> => {
  try {
    const rawParameters = await AsyncStorage.getItem(PARAMETERS_KEY);
    if (!rawParameters) return null;

    const Parameters = JSON.parse(rawParameters) as Record<string, Parameter>;
    return Parameters;
  } catch (error) {
    console.error("Error getting parameter info:", error);
    return null;
  }
};

export const setParameters = async (
  newParameters: Record<string, Parameter>
): Promise<void> => {
  try {
    const stringifiedParameters = JSON.stringify(newParameters);
    await AsyncStorage.setItem(PARAMETERS_KEY, stringifiedParameters);
  } catch (error) {
    console.error("Error setting parameter info:", error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(JWT_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const setToken = async (newToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(JWT_KEY, newToken);
  } catch (error) {
    console.error("Error setting token:", error);
    throw error;
  }
};

export const getUserInfo = async (): Promise<User | null> => {
  try {
    const rawUserInfo = await AsyncStorage.getItem(LOGGED_USER_INFO_KEY);
    if (!rawUserInfo) return null;

    const userInfo = JSON.parse(rawUserInfo) as User;
    return userInfo;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

export const setUserInfo = async (newUserInfo: User): Promise<void> => {
  try {
    const stringifiedUserInfo = JSON.stringify(newUserInfo);
    await AsyncStorage.setItem(LOGGED_USER_INFO_KEY, stringifiedUserInfo);
  } catch (error) {
    console.error("Error setting user info:", error);
    throw error;
  }
};

export const clearAllInfoFromLocalStorage = async () => {
  await AsyncStorage.removeItem(JWT_KEY);
  await AsyncStorage.removeItem(LOGGED_USER_INFO_KEY);
};
const decodeToken = (token: string): DecodedToken => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const isTokenValid = async (): Promise<boolean> => {
  const token = await getToken();
  if (!token) return false;
  try {
    const decodedToken = decodeToken(token);
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const remainingTime = expirationTime - currentTime;
    const remainingHours = remainingTime / (1000 * 60 * 60);

    return remainingHours >= MIN_REMAINING_HOURS;
  } catch (error) {
    return false;
  }
};
export const useLocalStorageAction = () => {
  const refresh = mutateEntity<
    AxiosResponse<
      Extract<
        Response<{ message: string; accessToken: string }>,
        { status: "Success" }
      >
    >,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body: { refreshToken: string } }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<
              Response<{ message: string; accessToken: string }>,
              { status: "Success" }
            >
          >("/auth/refresh-token", body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onSuccess: async (data, variables, context) => {
        const accessToken = data.data?.data?.accessToken || "";
        setToken(accessToken);
      },
    }
  );
  const refreshMutation = refresh();
  async function refreshCurrentToken() {
    if (await isTokenValid()) {
      return;
    }

    const userInfo = await getUserInfo();
    const currentRefreshToken = userInfo?.refreshToken;
    if (!currentRefreshToken) {
      return;
    }
    try {
      refreshMutation.mutate({ body: { refreshToken: currentRefreshToken } });
    } catch (error) {
      console.error("Error refreshing token", error);
    }
  }
  return { refreshCurrentToken };
};
