import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/clients";
import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity, queryEntity, queryEntityById } from "./action";
import { LOGGED_USER_INFO_KEY } from "~/constants/constants";
import { User, Response, Customer, AddressLocation } from "~/constants/models";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
const QUERY_KEY_CUSTOMER = "customer" as const;
export default function useCustomerAction() {
  const queryClient = useQueryClient();
  const authContext = useAuth();
  const fetchCustomerDetailsFunction = async (id: string) => {
    const response = await apiClient.get<
      Extract<Response<Customer>, { status: "Success" }>
    >(`/customers/get-details/${id}`);
    console.log("Customer details fetched:", JSON.stringify(response, null, 4));
    return response.data;
  };
  const updateCustomer = mutateEntity<
    AxiosResponse<Extract<Response<Customer>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: Partial<Customer>;
    }
  >(
    () => {
      return async function mutationFn({body}) {
        if (!body) {
          console.log("Customer is required");
          throw new Error("body is required");
        }
        try {
          const response = await apiClient.put<
            Extract<Response<Customer>, { status: "Success" }>
          >(`/customers/edit/${body.id}`, body);
          return response;
        } catch (error) {
          console.error("Error adding address:", error);
          throw error;
        }
      };
    },
    {
      onMutate: (res) => res,
      onError: (error, _variables, _context) => {
        console.error(JSON.stringify(error, null, 4));
        /*         notification.error({
          message: "Error",
          description: receivedErrorMessage,
          duration: 0,
        }); */
      },
      onSuccess(data, _variables, _context) {
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEY_CUSTOMER,
            _variables.body.id,
          ] as QueryKey,
        });
        /*         message.success({
          content: "Te has logueado correctamente",
          duration: 5,
        }); */
      },
    }
  );
  const getCustomerDetails = queryEntityById<
    Customer,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_CUSTOMER] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        console.log("Fetching customer details for ID:", id);
        const response = await apiClient.get<
          Extract<Response<Customer>, { status: "Success" }>
        >(`/customers/get-details/${id}`);
        console.log(response);
        return response.data.data;
      } catch (error) {
        console.log(JSON.stringify(error, null, 4));
        throw error;
      }
    };
  });
  return { updateCustomer, fetchCustomerDetailsFunction, getCustomerDetails };
}
