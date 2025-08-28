import { ActivityIndicator, FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";

import CategoriesHome from "~/components/epic/categoriesHome";
import ImageCarousel from "~/components/epic/imageCarousel";
import Veciproveedores from "~/components/epic/veciproveedores";
import ActiveOrderBanner from "~/components/epic/activeOrderBanner";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "~/components/epic/productCard";
import { Button } from "~/components/ui/button";
import { useProductAction } from "~/actions/product.action";
import { useLocation } from "~/components/ContextProviders/LocationProvider";
import { useBranchAction } from "~/actions/branch.action";
import HeaderHome from "~/components/epic/headerHome";
import React from "react";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import useCustomerAction from "~/actions/customer.action";

export default function HomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const branchAction = useBranchAction();
  const branchQuery = branchAction.getBranchById(id as string);
  const actions = useProductAction();
  const fetchProductsPage = actions.fetchProductsWithParametersPaginated;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: () => fetchProductsPage({ filters: { branchId: id as string } }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.meta.page;
      console.log("current page", currentPage);
      const totalPages = lastPage.data.meta.lastPage - 1;
      console.log("total pagse", totalPages);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  if (status === "pending") {
    return <ActivityIndicator />;
  }

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  const allProducts = data?.pages.flatMap((page) => page.data.data) || [];

  const ErrorComponent = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500 mb-4 text-center">
        No pudimos cargar los productos. Por favor intenta nuevamente.
      </Text>
      <Button
        onPress={() => refetch()}
        className="bg-primary px-6 py-2 rounded-full"
      >
        <Text className="text-white font-medium">Reintentar</Text>
      </Button>
    </View>
  );
  const ListHeader = () => (
    <View className="p-4">
    </View>
  );

  return (
    <View className="flex-1 mt-12">
      <FlatList
        ListHeaderComponent={ListHeader}
        data={!allProducts ? [] : [...allProducts]}
        ListEmptyComponent={isError ? ErrorComponent : null}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        renderItem={({ item, index }) => (
          <View
            className="mb-4 w-[48%]"
            style={{ marginTop: index % 2 === 0 ? -16 : 16 }}
          >
            <ProductCard
              title={item.name}
              price={Number.parseFloat(item.price)}
              distance={item.distance || ""}
              rating={item.rating}
              category={item.categoryId}
              type={item.type}
              imageUrl={item.logo || ""}
              discount={Number.parseFloat(item.discount)}
              onPress={() => {
                router.push({
                  pathname: "/(client)/(customerscreens)/product/[id]",
                  params: { id: item.id },
                });
              }}
            />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </View>
  );
}
