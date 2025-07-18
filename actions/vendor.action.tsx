import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntity,
  queryEntityById,
  queryMultipleEntitiesById,
} from "./action";
import { QueryKey } from "@tanstack/react-query";
import { Vendor, Response } from "~/constants/models";
import { apiClient } from "~/services/clients";

interface ValidateAccountForm {
  pass: string;
  code: string;
  hash: string;
}
export const QUERY_KEY_VENDOR = "vendor" as const;

export const useVendorAction = () => {
  const getVendorById = queryEntityById<
    Vendor,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_VENDOR] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Vendor>, { status: "Success" }>
        >(`/vendors/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  return {
    getVendorById,
  };
};
