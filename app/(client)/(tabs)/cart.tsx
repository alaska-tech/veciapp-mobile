import { RefreshControl, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import CartCard from "~/components/epic/cartCard";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MapPinIcon } from "lucide-react-native";
import { useCartItemsByBranch, useCartStore } from "~/store/cartStore";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import useCustomerAction from "~/actions/customer.action";
import { useProductAction } from "~/actions/product.action";
import { useBranchAction } from "~/actions/branch.action";
import { apiClient } from "~/services/clients";
import { useOrderActions } from "~/actions/order.action";
import { ServiceOrderPaymentMethodType } from "~/constants/models";
import { useGlobalLoadingScreen } from "~/store/loadingStore";

const SERVICE_FEE_PERCENTAGE = 0.1;
const DELIVERY_CHARGE = 10000;

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const customerActions = useCustomerAction();
  const customer = customerActions.getCustomerDetails(user?.foreignPersonId);
  const productActions = useProductAction();
  const branchActions = useBranchAction();
  const { address = '{"address":"Desconocido"}' } = customer.data ?? {};
  const parsedAddress = JSON.parse(address);
  // Usar el store de Zustand para gestionar el estado del carrito
  const {
    cartItems,
    updateCartItemQuantity,
    removeCartItem,
    refresh,
    loading,
  } = useCartStore();

  // Manejadores de eventos que ahora usan las acciones de Zustand
  const handleQuantityChange = (
    productServiceId: string,
    newQuantity: number,
    price: number
  ) => {
    updateCartItemQuantity(productServiceId, newQuantity, price);
  };

  const handleDelete = (productServiceId: string) => {
    removeCartItem(productServiceId);
  };
  function handleRefresh() {
    refresh();
  }
  const handlePayment = (cartType: "regular") => {
    console.log(`Processing ${cartType} payment...`);
  };
  const productsQuery = productActions.getProductsById(
    cartItems?.map((e) => e.productServiceId)
  );

  const cartItemsByBranch = useCartItemsByBranch();
  const cartItemsFromQueryLenght = cartItems.length || 0;
  const branchesQuery = branchActions.getBranchesById(
    Object.keys(cartItemsByBranch)
  );

  const orderActions = useOrderActions();
  const createOrderMutation = orderActions.createServiceOrder();
  const { setIsLoading } = useGlobalLoadingScreen();
  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Carrito de compras",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView
        className="h-full w-full p-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* <Text>{JSON.stringify(cartItems, null, 4)}</Text> */}
        <View className="flex-row items-center flex-1 ml-2 mb-4 pb-4 border-b border-gray-300">
          <MapPinIcon size={20} color="#ffffff" fill="#666" />
          <Text className="text-gray-500 text-md pr-1">Enviar a</Text>
          <Text
            className="text-black text-md font-bold flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {parsedAddress?.address || ""}
          </Text>
        </View>
        {Object.entries(cartItemsByBranch)
          .sort(([branchId1, cartItem1], [branchId2, cartItem2]) => {
            return cartItem2.mostRecentDate - cartItem1.mostRecentDate;
          })
          .map(([branchId, cartItem]) => {
            const branch = branchesQuery.find(
              (e) => e.data?.id === branchId
            )?.data;
            const serviceCharge = cartItem.subtotal * SERVICE_FEE_PERCENTAGE;

            const total = cartItem.subtotal + serviceCharge + DELIVERY_CHARGE;
            return (
              <React.Fragment key={branchId}>
                {/* <Text>{JSON.stringify(cartItem, null, 4)}</Text> */}
                <CartCard
                  providerName={branch?.name || "Desconocido"}
                  providerImage={branch?.logo || "https://picsum.photos/200"}
                  distance="---"
                  items={cartItem.ShoppingCartItem.map((item) => {
                    const product = productsQuery.find(
                      (e) => e.data?.id === item.productServiceId
                    )?.data;
                    return {
                      name: product?.name || "Desconocido",
                      price: Number(item.unitPrice) * item.quantity,
                      image: product?.logo || "",
                      quantity: item.quantity,
                      productServiceId: item.productServiceId,
                      inventory: product?.inventory || 0,
                    };
                  })}
                  subtotal={cartItem.subtotal}
                  serviceCharge={serviceCharge}
                  deliveryFee={DELIVERY_CHARGE}
                  total={total}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDelete}
                  onPayPress={async (closeModal, paymentMethod) => {
                    setIsLoading(true);
                    await createOrderMutation
                      .mutateAsync({
                        body: {
                          customerId: user?.foreignPersonId,
                          vendorId: branch?.vendorId,
                          branchId: branchId,
                          products: cartItem.ShoppingCartItem.map((item) => {
                            return {
                              productServiceId: item.productServiceId,
                              quantity: item.quantity,
                              price: item.unitPrice,
                            };
                          }),
                          totalAmount: total,
                          paymentMethod: paymentMethod,
                          deliveryType: "delivery",
                          deliveryAddress: address,
                        },
                      })
                      .then(
                        () => {
                          router.replace(
                            "/(client)/(customerscreens)/paymentResultScreen"
                          );
                        },
                        () => {}
                      )
                      .finally(() => {
                        closeModal();
                        setIsLoading(false);
                      });
                  }}
                />
              </React.Fragment>
            );
          })}
        {cartItemsFromQueryLenght === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-xl text-gray-500 mb-6">
              Tu carrito está vacío
            </Text>
            <Button
              className="bg-yellow-400 rounded-full px-8"
              onPress={() => router.push("/home")}
            >
              <Text className="text-black font-bold">Explorar productos</Text>
            </Button>
          </View>
        ) : (
          <></>
        )}
        <View className="mt-8 mb-8 px-0">
          <Button
            onPress={() => {
              apiClient.delete(
                `/shoppingcart/clear-cart/customer/${user?.foreignPersonId}`
              );
            }}
            variant="outline"
            size="lg"
            className="w-full rounded-full border-gray-200 bg-gray-100"
          >
            <Text className="text-gray-700 font-normal">Vaciar carrito</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
