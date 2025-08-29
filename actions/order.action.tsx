import { AxiosError, AxiosResponse } from "axios";
import {
  mutateEntity,
  queryEntityById,
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
import { showNetworkErrorDialog } from "~/components/epic/networkErrorDialog";

export const QUERY_KEY_SERVICE_ORDER = "serviceOrder" as const;

export const useOrderActions = () => {
  const createServiceOrder = mutateEntity<
    AxiosResponse<Extract<Response<ServiceOrder>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: any;
    }
  >(
    () => {
      return async function mutationFn({ body }) {
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
        showNetworkErrorDialog(error.response?.data?.error?.message || "");
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
  const getOrdersByCustomerId = queryEntityById<
    PaginatedResult<ServiceOrder>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_SERVICE_ORDER] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<
            Response<PaginatedResult<ServiceOrder>>,
            { status: "Success" }
          >
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
  return { createServiceOrder, getServiceOrderDetails, getOrdersByCustomerId };
};
