import { useMutation } from "@tanstack/react-query";
import { mutateEntity } from "./action";
import { AxiosError, AxiosResponse } from "axios";
import { JWT_KEY, LOGGED_USER_INFO_KEY } from "~/constants/constants";
import { apiClient } from "~/services/clients";
import { User, Response } from "~/constants/models";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const MIN_REMAINING_HOURS = 24;

export const getToken = async (): Promise<string | null> => {
  const jwt = await AsyncStorage.getItem(JWT_KEY);
  return jwt;
};

export const setToken = async (newToken: string) => {
  await AsyncStorage.setItem(JWT_KEY, newToken);
};

export const getUserInfo = async (): Promise<User | null> => {
  const rawUserInfo =
    (await AsyncStorage.getItem(LOGGED_USER_INFO_KEY)) || "null";
  const userInfo = JSON.parse(rawUserInfo);
  return userInfo;
};

export const setUserInfo = async (newUserInfo: User) => {
  const stringifiedUserInfo = JSON.stringify(newUserInfo);
  await AsyncStorage.setItem(LOGGED_USER_INFO_KEY, stringifiedUserInfo);
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
