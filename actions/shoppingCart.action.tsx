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

export function updateProductQuatityInCart(props: {
  //if quantity is 0, it means deleting
  clientId: string;
  productServiceId: string;
  quantity: number;
}): Response<unknown> {
  return {} as Response<unknown>;
}

export async function createCart(
  clientId: string,
  productServiceDto: {
    productServiceId: string;
    quantity: number;
    price: number;
  }
) {
  const res = await apiClient.post<AxiosResponse<Response<null>>>(
    "/shoppingcart",
    {
      clientId,
      ...productServiceDto,
    }
  );
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

export async function updateCart(
  customerId: string,
  items: {
    quantity: number;
    productServiceId: string;
    updatedBy: string;
  }
) {
  const res = await apiClient.put<Response<ShoppingCartStore>>(
    `/shoppingcart/update/${customerId}`,
    { ...items }
  );
  return res.data;
}

export async function deleteItemFromCart(productServiceId: string, items: any) {
  const res = await apiClient.delete<
    AxiosResponse<Response<ShoppingCartStore>>
  >(`/shoppingcart/delete-item/${productServiceId}`);
  return res.data;
}

export async function clearCart(customerId: string) {
  const res = await apiClient.get<AxiosResponse<Response<ShoppingCartStore>>>(
    `/shoppingcart/clear-cart/customer/${customerId}`
  );
  return res.data;
}
