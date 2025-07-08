import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../services/clients";
import { AxiosError, AxiosResponse } from "axios";
import { mutateEntity } from "./action";
import { LOGGED_USER_INFO_KEY } from "~/constants/constants";
import { User, Response, Customer, AddressLocation } from "~/constants/models";
import { useAuth } from "~/components/ContextProviders/AuthProvider";

export default function useCustomerAction() {
  const queryClient = useQueryClient();
  const authContext = useAuth();
  const customer = authContext.customer;
  const fetchCustomerDetailsFunction = async (id: string) => {
    const response = await apiClient.get<
      Extract<Response<Customer>, { status: "Success" }>
    >(`/customers/get-details/${id}`);
    console.log("Customer details fetched:", JSON.stringify(response, null, 4));
    return response.data;
  };
  const addAddress = mutateEntity<
    AxiosResponse<Extract<Response<Customer>, { status: "Success" }>>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    {
      body: AddressLocation;
    }
  >(
    () => {
      return async function mutationFn({ body }) {
        console.log("Adding address:", body);
        if (!customer) {
          console.log("Customer is required");
          throw new Error("Customer is required");
        }
        const newCustomer = {
          locations: [...(customer.locations || []), body],
        };
        console.log("newCustomer", body);
        try {
          if (!body) {
            console.log("No body provided");
            throw new Error("No body provided");
          }
          const response = await apiClient.put<
            Extract<Response<Customer>, { status: "Success" }>
          >(`/customers/edit/${customer.id}`, newCustomer);
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
  return { addAddress, fetchCustomerDetailsFunction };
}
