import { AxiosError, AxiosResponse } from "axios";
import {
  queryEntity,
  queryEntityById,
  queryEntityWithParameters,
  queryMultipleEntitiesById,
} from "./action";
import {
  PaginatedResult,
  Response,
  Product,
  productServiceStateType,
} from "../constants/models";
import { QueryKey } from "@tanstack/react-query";
import { apiClient } from "~/services/clients";

export const QUERY_KEY_PRODUCT = "Product" as const;
export interface IProductQueryParams {
  limit?: number;
  page?: number;
  filters?: {
    vendorId?: string;
    branchId?: string;
    categoryId?: string;
    type?: string;
    state?: productServiceStateType[number];
    isHighlighted?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    search?: string;
  };
}
export const useProductAction = () => {
  const fetchProductsFunction = async ({
    pageParam = 0,
    filters,
  }: {
    pageParam?: number;
    filters?: Record<string, string>;
  }) => {
    const response = await apiClient.get<
      Extract<Response<PaginatedResult<Product>>, { status: "Success" }>
    >(`/productservice/list?page=${pageParam}&limit=10`, {
      params: {
        ...filters,
      },
    });
    console.log("fetchProductsFunctions", JSON.stringify(response));
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
          Extract<Response<{ data: Product }>, { status: "Success" }>
        >(`/productservice/get-details/${id}`);
        console.log(response);
        return response.data.data.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const getProductsById = queryMultipleEntitiesById<
    Product,
    AxiosError<Extract<Response<null>, { status: "Error" }>>
  >([QUERY_KEY_PRODUCT] as QueryKey, (id) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<{ data: Product }>, { status: "Success" }>
        >(`/productservice/get-details/${id}`);
        console.log(response);
        return response.data.data.data;
      } catch (error) {
        throw error;
      }
    };
  });

  const getProductsWithParametersPaginated = queryEntityWithParameters<
    Extract<Response<PaginatedResult<Product>>, { status: "Success" }>,
    AxiosError<Extract<Response<null>, { status: "Error" }>>,
    IProductQueryParams
  >([QUERY_KEY_PRODUCT] as QueryKey, ({ limit, page, filters }) => {
    return async function queryFn() {
      try {
        const response = await apiClient.get<
          Extract<Response<PaginatedResult<Product>>, { status: "Success" }>
        >(`/productservice/search`, {
          params: {
            page,
            limit,
            ...filters,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };
  });
  const fetchProductsWithParametersPaginated = async ({
    page = 0,
    limit = 10,
    filters,
  }: IProductQueryParams) => {
    const response = await apiClient.get<
      Extract<Response<PaginatedResult<Product>>, { status: "Success" }>
    >(`/productservice/search`, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    console.log("fetchProductsWithParametersPaginated", response.data);
    return response.data;
  };
  return {
    fetchProductsFunction,
    getProducts,
    getProductById,
    getProductsById,
    getProductsWithParametersPaginated,
    fetchProductsWithParametersPaginated,
  };
};
