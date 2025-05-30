import { AxiosError, AxiosResponse } from "axios";
import { queryEntity, queryEntityById } from "./action";
import { PaginatedResult, Response, Product } from "../constants/models";
import { QueryKey } from "@tanstack/react-query";
import { apiClient } from "~/services/clients";

export const QUERY_KEY_PRODUCT = "Product" as const;

export const useProductAction = () => {
  const fetchProductsFunction = async ({ pageParam = 0 }) => {
    const response = await apiClient.get<
      Extract<Response<PaginatedResult<Product>>, { status: "Success" }>
    >(`/productservice/list?page=${pageParam}&limit=10`);
    return response.data;
  };
  const getProducts = queryEntity<
    AxiosResponse<
      Extract<Response<PaginatedResult<Product>>, { status: "Success" }>
    >["data"],
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCT + "s"] as QueryKey, async ({ pageParam = 0 }) => {
    try {
      const response = await apiClient.get<
        Extract<Response<PaginatedResult<Product>>, { status: "Success" }>
      >(`/productservice/list?page=${pageParam}&limit=10`);
      return response.data;
    } catch (error) {
      throw error;
    }
  });
  const getProductById = queryEntityById<
    Product,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCT] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<Product>, { status: "Success" }>
        >(`/productservice/get-details/${id}`);
        console.log(response)
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  return {
    fetchProductsFunction,
    getProducts,getProductById
  };
};
