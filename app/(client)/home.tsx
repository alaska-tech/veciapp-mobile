import { ActivityIndicator, FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import HeaderHome from "../../components/epic/headerHome";
import CategoriesHome from "~/components/epic/categoriesHome";
import PromoCard from "~/components/epic/promoCard";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "~/components/epic/productCard";
import { Button } from "~/components/ui/button";
import { useProductAction } from "~/actions/product.action";
import { useParameters } from "~/components/ContextProviders/ParametersProvider";

export default function HomeScreen() {
  const router = useRouter();
  const actions = useProductAction();
  const fetchProductsPage = actions.fetchProductsFunction;
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
    queryFn: fetchProductsPage,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.meta.page + 1;
      const totalPages = lastPage.data.meta.lastPage;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });
  const parameters = useParameters();
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
      <HeaderHome />
      <PromoCard
        title="¡Oferta del día!"
        subtitle="Solo por hoy"
        buttonText="Aprovecha de una"
        image="https://picsum.photos/200"
        onPress={() => {
          router.push("/(client)/cart");
        }}
      />
      <CategoriesHome />
      <View className="mt-4">
        <Text className="text-2xl font-bold">Recomendados</Text>
        <Text className="text-2xl font-bold mb-4">Para ti</Text>
      </View>
    </View>
  );
  return (
    <View className="flex-1 mt-12">
      <FlatList
        ListHeaderComponent={ListHeader}
        data={isError ? [] : [...allProducts]}
        ListEmptyComponent={isError ? ErrorComponent : null}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={
          isError
            ? undefined
            : {
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }
        }
        renderItem={({ item, index }) => (
          <View
            className="mb-4 w-[48%]"
            style={{ marginTop: index % 2 === 0 ? -16 : 16 }}
          >
            <ProductCard
              title={item.name}
              price={Number.parseFloat(item.price)}
              distance={"1km"}
              rating={3}
              category={item.categoryId}
              imageUrl={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/NCI_Visuals_Food_Hamburger.jpg/1200px-NCI_Visuals_Food_Hamburger.jpg"
              }
              discount={Number.parseFloat(item.discount)}
              onPress={() => {
                console.log(JSON.stringify(item, null, 4));
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
