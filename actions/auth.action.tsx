import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/clients";
import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity } from "./action";
import { LOGGED_USER_INFO_KEY } from "~/constants/constants";
import { User, Response } from "~/constants/models";
import { Alert } from "react-native";

export interface UpdatePasswordBody {
  password: string;
  confirm: string;
  token: string | string[] | undefined;
  onSuccess?: (response: AxiosResponse<User, any>) => void;
}
export type LogInResponse = {
  token: string;
  user: User;
};
export default function useAuthAction() {
  const queryClient = useQueryClient();
  /*   const userSession = useQuery<User | null>({
    queryKey: [LOGGED_USER_INFO_KEY],
    queryFn: () => {
      const loggedUserInfo = localStorage.getItem(LOGGED_USER_INFO_KEY);
      if (!loggedUserInfo) {
        return null;
      }
      return JSON.parse(loggedUserInfo) as User;
    },
  }); */

  const logOut = mutateEntity<
    AxiosResponse<Extract<Response<null>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { body?: null }
  >(
    () => {
      return async function mutationFn() {
        try {
          const response = await apiClient.post<
            Extract<Response<null>, { status: "Success" }>
          >(`/auth/logout`);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        const receivedErrorMessage = error.response?.data.error.message;
        /*         notification.error({
          message: "Error",
          description: receivedErrorMessage,
          duration: 0,
        }); */
      },
      onSuccess(data, _variables, _context) {
        /*         message.success({
          content: "Te has deslogueado correctamente",
          duration: 5,
        }); */
      },
    }
  );

  const logIn = mutateEntity<
    AxiosResponse<Extract<Response<LogInResponse>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: {
        email: string;
        password: string;
      };
    }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<LogInResponse>, { status: "Success" }>
          >(`/auth/login`, body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        const receivedErrorMessage = error.response?.data.error.message;
        console.error(JSON.stringify(error, null, 4));
        /*         notification.error({
          message: "Error",
          description: receivedErrorMessage,
          duration: 0,
        }); */
      },
      onSuccess(data, _variables, _context) {
        /*         message.success({
          content: "Te has logueado correctamente",
          duration: 5,
        }); */
      },
    }
  );
  interface registerForm {
    fullName: string;
    email: string;
    password: string;
  }
  const register = mutateEntity<
    AxiosResponse<Extract<Response<unknown>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: registerForm;
    }
  >(
    () => {
      return async function mutationFn({ body }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<unknown>, { status: "Success" }>
          >(`/customers`, body);
          console.log(JSON.stringify(response))
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        console.log("Error al crear cuenta nueva",JSON.stringify(error))
        const receivedErrorMessage =
          error.response?.data.error.message || "Intenté de nuevo";
        console.error(JSON.stringify(error, null, 4));
        Alert.alert("Error", receivedErrorMessage);
      },
      onSuccess(response, _variables, _context) {
        //Alert.alert("Exito");
      },
    }
  );
  return { logOut, logIn, register };
}
