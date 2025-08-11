import { AxiosError, AxiosResponse } from "axios";
import { FavoriteItem, Product, Response } from "~/constants/models";
import { apiClient } from "~/services/clients";
import { queryEntityById } from "./action";
import { QueryKey } from "@tanstack/react-query";

export async function addToFavorite({
  customerId,
  productServiceId,
}: {
  customerId: string;
  productServiceId: string;
}) {
  const res = await apiClient.post<
    AxiosResponse<
      Response<{
        id: string;
        userId: string;
        productServiceId: string;
        message: string;
      }>
    >
  >("/favorites", {
    userId: customerId,
    productServiceId: productServiceId,
  });
  console.log("addtofav response", JSON.stringify(res));
  return res.data;
}
export async function deleteFromFavorite({
  customerId,
  productServiceId,
}: {
  customerId: string;
  productServiceId: string;
}) {
  const res = await apiClient.delete<
    AxiosResponse<
      Response<{
        message: string;
      }>
    >
  >("/favorites/delete/" + customerId + "/" + productServiceId);
  return res.data;
}

export async function fetchFavoritesByCustomerId({
  customerId,
}: {
  customerId: string;
}) {
  const response = await apiClient.get<
    Extract<
      Response<
        FavoriteItem[]
      >,
      { status: "Success" }
    >
  >(`/favorites/list/${customerId}`);
  return response.data;
}

