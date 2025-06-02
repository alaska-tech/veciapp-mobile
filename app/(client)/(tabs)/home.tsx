import { ActivityIndicator, FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import HeaderHome from "../../../components/epic/headerHome";
import CategoriesHome from "~/components/epic/categoriesHome";
import ImageCarousel from "~/components/epic/imageCarousel";
import Veciproveedores from "~/components/epic/veciproveedores";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "~/components/epic/productCard";
import { Button } from "~/components/ui/button";
import { useProductAction } from "~/actions/product.action";
import { useParameters } from "~/components/ContextProviders/ParametersProvider";

const sampleProveedores = [
  {
    id: "1",
    name: "Super Tienda",
    imageUrl: "https://picsum.photos/200",
  },
  {
    id: "2",
    name: "Terribol Mascotas",
    imageUrl: "https://picsum.photos/201",
  },
  {
    id: "3",
    name: "Belleza & Estilo",
    imageUrl: "https://picsum.photos/202",
  },
  {
    id: "4",
    name: "Moda Express",
    imageUrl: "https://picsum.photos/203",
  },
  {
    id: "5",
    name: "Frutas & Verduras",
    imageUrl: "https://picsum.photos/204",
  },
  {
    id: "6",
    name: "Tech Gadgets",
    imageUrl: "https://picsum.photos/205",
  },
  {
    id: "7",
    name: "Artesanías",
    imageUrl: "https://picsum.photos/206",
  },
];

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
      <ImageCarousel />
      <Veciproveedores
        proveedores={sampleProveedores}
        onSeeAllPress={() => {
          console.log("Ver todos pressed");
          // Navigate to all providers screen
          router.push('/(customerscreens)/allVendorsScreen');
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
              distance={item.distance || ""}
              rating={item.rating}
              category={item.categoryId}
              imageUrl={item.mainImage || ""}
              discount={Number.parseFloat(item.discount)}
              onPress={() => {
                router.push({
                  pathname: "/(client)/product/[id]",
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
