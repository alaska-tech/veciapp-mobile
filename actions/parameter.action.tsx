import { Parameter, Response } from "./../constants/models";
import { apiClient } from "~/services/clients";
import { getToken, setParameters } from "./localStorage.actions";

export const QUERY_KEY_PARAMETER = "parameters" as const;
export const fetchParameters = async () => {
  try {
    const response = await apiClient.get<
      Extract<Response<Parameter[]>, { status: "Success" }>
    >(`/parameters/list?limit=100&page=0`);
    console.log(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshParameters = async () => {
  try {
    const jwt = await getToken();
    if (!jwt) return;
    const response = await fetchParameters();
    const parameters = response.data.data || [];
    await setParameters(response.data.data);
    return parameters;
  } catch (error) {
    console.error("Error in refreshParameters:", error);
    return null;
  }
};
