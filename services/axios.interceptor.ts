import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useRouter } from "expo-router";
import {
  clearAllInfoFromLocalStorage,
  getToken,
} from "~/actions/localStorage.actions";

const addJwtToHeader = async (request: AxiosRequestConfig) => {
  const jwt = await getToken();
  if (jwt) {
    const newHeader = {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    };
    request.headers = newHeader;
  }
  return request;
};

const onRequest = (config: AxiosRequestConfig): any => {
  //el tipo correcto de retorno es AxiosRequestConfig, pero Axios me lo esta tomando como error
  const newConfig = addJwtToHeader(config);
  return newConfig;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  const router = useRouter();
  if (error.response?.status === 403) {
    //TODO: Comprobar que el error es 403 para cuando el usuario no tenga permisos
    await clearAllInfoFromLocalStorage();
    router.dismissTo("/");
    /* window.location.href = '/' */
  }
  return Promise.reject(error);
};

export function addJWTInterceptor(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
