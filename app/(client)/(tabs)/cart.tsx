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
  const handleQuantityChange = (index: number, newQuantity: number) => {
    updateCartItemQuantity(index, newQuantity);
  };

  const handleDelete = (index: number) => {
    removeCartItem(index);
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
        {Object.entries(cartItemsByBranch).map(([branchId, cartItem]) => {
          const branch = branchesQuery.find(
            (e) => e.data?.id === branchId
          )?.data;
          const subtotal = cartItem.reduce((acc, item) => {
            return acc + Number.parseFloat(item.totalPrice || "0");
          }, 0);
          const serviceCharge = subtotal * SERVICE_FEE_PERCENTAGE;

          const total = subtotal + serviceCharge + DELIVERY_CHARGE;
          return (
            <>
              {/* <Text>{JSON.stringify(cartItem, null, 4)}</Text> */}
              <CartCard
                providerName={branch?.name || "Desconocido"}
                providerImage={branch?.logo || "https://picsum.photos/200"}
                distance="---"
                items={cartItem.map((item) => {
                  const product = productsQuery.find(
                    (e) => e.data?.id === item.productServiceId
                  )?.data;
                  return {
                    name: product?.name || "Desconocido",
                    price: Number(item.unitPrice)*item.quantity,
                    image: product?.logo || "",
                    quantity: item.quantity,
                  };
                })}
                subtotal={subtotal}
                serviceCharge={serviceCharge}
                deliveryFee={DELIVERY_CHARGE}
                total={total}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
                onPayPress={() => handlePayment("regular")}
              />
            </>
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
      </ScrollView>
    </>
  );
}
