import { AxiosError } from "axios";
import {
  queryEntityById,
  queryEntityWithParameters,
  queryMultipleEntitiesById,
} from "./action";
import { QueryKey } from "@tanstack/react-query";
import { Branch, PaginatedResult, Response } from "~/constants/models";
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
  const getBranchesById = queryMultipleEntitiesById<
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
  const getBranchesByLocation = queryEntityWithParameters<
    Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >(
    [QUERY_KEY_BRANCH] as QueryKey,
    ({ latitude, longitude, limit, page, radius }) => {
      return async function queryFn() {
        const limitParam = limit ? `&limit=${limit}` : "";
        const pageParam = page ? `&page=${page}` : "";
        try {
          const response = await apiClient.get<
            Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
          >(
            `/branches/get-nearby-branches?latitude=${latitude}&longitude=${longitude}&radius=${radius}${limitParam}${pageParam}`
          );
          console.log(response);
          return response.data;
        } catch (error) {
          throw error;
        }
      };
    }
  );
  const getBranchesByVendorId = queryEntityById<
    PaginatedResult<Branch>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_BRANCH] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Branch>>, { status: "Success" }>
        >(`/branches/${id}/all-branches`, {
          params: {
            limit: 100,
            page: 0,
          },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  return {
    getBranchById,
    getBranchesByLocation,
    getBranchesByVendorId,
    getBranchesById,
  };
};
