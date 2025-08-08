import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntityWithParameters,
} from "./action";
import { QueryKey } from "@tanstack/react-query";
import {
  BaseAttributes,
  PaginatedResult,
  Response,
  ServiceOrder,
} from "~/constants/models";
import { apiClient } from "~/services/clients";

export const QUERY_KEY_SERVICE_ORDER = "serviceOrder" as const;

export const useBranchAction = () => {
  const createServiceOrder = mutateEntity<
    AxiosResponse<Extract<Response<ServiceOrder>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: Omit<
        ServiceOrder,
        keyof BaseAttributes &
          "id" &
          "orderNumber" &
          "orderStatus" &
          "paymentStatus"
      >;
      vendorId: string;
    }
  >(
    () => {
      return async function mutationFn({ body, vendorId }) {
        try {
          if (!body) {
            throw new Error("No body provided");
          }
          const response = await apiClient.post<
            Extract<Response<ServiceOrder>, { status: "Success" }>
          >("/orders", body);
          return response;
        } catch (error) {
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, variables, context) => {
        //visual notification
      },
      onSuccess: async (data, variables, context) => {
        //visual notification
      },
    }
  );
  const getServiceOrderDetails = queryEntityWithParameters<
    Extract<Response<PaginatedResult<ServiceOrder>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    { serviceOrderId: string }
  >([QUERY_KEY_SERVICE_ORDER] as QueryKey, ({ serviceOrderId }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<ServiceOrder>>,
            { status: "Success" }
          >
        >("/orders/get-details/" + serviceOrderId);
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  return { createServiceOrder, getServiceOrderDetails };
};
