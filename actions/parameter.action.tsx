import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { queryMultipleEntitiesById } from "./action";
import { AxiosError, AxiosResponse } from "axios";
import { Parameter, Response } from "./../constants/models";
import { apiClient } from "~/services/clients";
import { setParameters } from "./localStorage.actions";

export const QUERY_KEY_PARAMETER = "parameters" as const;
export const fetchParametersByNameFunction = (name: string) => {
  return async function queryFn() {
    try {
      const response = await apiClient.get<
        Extract<Response<Parameter>, { status: "Success" }>
      >(`/parameters/get-by-name/${name}`);
      console.log(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  };
};
const fetchParameterSafely = async (name: string) => {
  try {
    const { data } = await fetchParametersByNameFunction(name)();
    return data.data;
  } catch (error) {
    console.error(`Error fetching parameter ${name}:`, error);
    return {} as Parameter;
  }
};

export const refreshParameters = async () => {
  try {
    const [comission, currency, userState, categories] = await Promise.allSettled([
      fetchParameterSafely('comission'),
      fetchParameterSafely('currency2'),
      fetchParameterSafely('userState'),
      fetchParameterSafely('categories'),
    ]);

    const parameters = {
      comission: comission.status === 'fulfilled' ? comission.value : {} as Parameter,
      currency: currency.status === 'fulfilled' ? currency.value : {} as Parameter,
      userState: userState.status === 'fulfilled' ? userState.value : {} as Parameter,
      categories: categories.status === 'fulfilled' ? categories.value : {} as Parameter,
    };

    await setParameters(parameters);
    return parameters;
  } catch (error) {
    console.error('Error in refreshParameters:', error);
    return null;
  }
};
export const useParameterAction = <T extends object>() => {
  const queryClient = useQueryClient();
  const getParametersByName = queryMultipleEntitiesById<
    AxiosResponse<Extract<Response<Parameter>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PARAMETER, "byName"] as QueryKey, fetchParametersByNameFunction);

  return {
    getParametersByName,
  };
};
