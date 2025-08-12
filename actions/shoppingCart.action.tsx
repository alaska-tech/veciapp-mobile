import { AxiosResponse } from "axios";
import { Response, ShoppingCartItem } from "~/constants/models";
import { apiClient } from "~/services/clients";
import { ShoppingCartStore } from "~/store/cartStore";

export async function addProductToCart({
  customerId,
  productServiceId,
  quantity,
  unitPrice,
  branchId,
}: {
  customerId: string;
  productServiceId: string;
  quantity: number;
  unitPrice: number;
  branchId: string;
}): Promise<Response<unknown>> {
  const res = await apiClient.post("/shoppingcart", {
    customerId: customerId,
    productServiceId: productServiceId,
    quantity: quantity,
    unitPrice: unitPrice,
    branchId: branchId,
  });
  return res.data;
}

export async function fetchCartItemsByCustomerId(customerId: string) {
  const res = await apiClient.get<
    Response<{
      shoppingCarts: ShoppingCartItem[];
    }>
  >(`/shoppingcart/customer/${customerId}`);
  return res.data;
}

export async function updateProductQuatityInCart(
  shoppingCartEntryId: string,
  items: {
    quantity: number;
    productServiceId: string;
    price:number;
  }
) {
  const res = await apiClient.put<Response<ShoppingCartStore>>(
    `/shoppingcart/update/${shoppingCartEntryId}`,
    { ...items }
  );
  return res.data;
}

export async function deleteItemFromCart(shoppingCartEntryId: string) {
  const res = await apiClient.delete<
    AxiosResponse<Response<ShoppingCartStore>>
  >(`/shoppingcart/delete-item/${shoppingCartEntryId}`);
  return res.data;
}

