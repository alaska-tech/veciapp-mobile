import { AxiosError } from "axios";
import { queryEntityById } from "./action";
import { QueryKey } from "@tanstack/react-query";
import { Branch, Response } from "~/constants/models";
import { apiClient } from "~/services/clients";

export const QUERY_KEY_BRANCH = "branch" as const;

export const useBranchAction = () => {
  const getBranchById = queryEntityById<
    Branch,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Branch>, { status: "Success" }>
        >(`/branches/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  return {
    getBranchById,
  };
};
