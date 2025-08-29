import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import FilterSheet, {
  FilterSheetRef,
} from "~/components/epic/bottomSheetFilter";
import ProductCard from "~/components/epic/productCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  useProductAction,
} from "~/actions/product.action";

const categories = [
  "Todas las categorias",
  "Gastronomía",
  "Belleza",
  "Confecciones",
];

// ListHeader fuera del cuerpo principal
function ListHeader({
  searchText,
  setSearchText,
  selectedTab,
  setSelectedTab,
  selectedCategory,
  filterSheetRef,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedCategory: string;
  filterSheetRef: React.RefObject<any>;
}) {
  return (
    <View className="pt-6 pb-2 px-4 bg-white">
      {/* barra de búsqueda */}
      <View className="flex-row items-center rounded-lg relative mb-4">
        <Input
          placeholder="Busca en Empanadas para hoy"
          className="flex-1 py-3 text-base pl-12 rounded-full border border-gray-400"
          value={searchText}
          onChangeText={setSearchText}
        />
        {!searchText && (
          <View className="absolute left-3 top-3">
            <Search size={20} color="#666" />
          </View>
        )}
      </View>
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="flex-row bg-gray-100 rounded-md mb-4">
          <TabsTrigger value="product" className="flex-1 rounded-md px-2">
            <Text>Productos</Text>
          </TabsTrigger>
          <TabsTrigger value="service" className="flex-1 rounded-md px-2">
            <Text>Servicios</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Filtros */}
      <View className="flex-row justify-between items-center mb-8">
        <TouchableOpacity onPress={() => filterSheetRef.current?.show()}>
          <View>
            <Text className="text-gray-600">Buscar en:</Text>
            <Text className="text-base font-medium">{selectedCategory} ▼</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const filterSheetRef = useRef<FilterSheetRef>(null);

  // Recibir parámetro de categoría
  const params = useLocalSearchParams();
  const initialCategory =
    typeof params.category === "string"
      ? params.category
      : "Todas las categorias";

  // Estados de filtros y búsqueda
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("product");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Lógica de productos (puedes adaptar para servicios si tienes endpoint)
  const actions = useProductAction();
  const fetchProductsPageWithSearchText =
    actions.fetchProductsWithParametersPaginated({
      filters: {
        search: searchText,
        type: selectedTab,
        categoryId: selectedCategory,
      },
    });
  const fetchProducts = actions.fetchProductsFunction;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      {
        filters: {
          search: searchText,
          type: selectedTab,
          categoryId:
            selectedCategory === "Todas las categorias"
              ? null
              : selectedCategory,
        },
      },
    ],
    queryFn: () => {
      if (searchText === "") {
        return fetchProducts({
          filters: {
            categoryId:
              selectedCategory === "Todas las categorias"
                ? ""
                : selectedCategory,
            type: selectedTab,
          },
        });
      }
      return fetchProductsPageWithSearchText;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.meta.page;
      console.log("current page", currentPage);
      const totalPages = lastPage.data.meta.lastPage - 1;
      console.log("total pagse", totalPages);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
  const allProducts = data?.pages.flatMap((page) => page.data.data) || [];

  const renderProduct = ({ item, index }: { item: any; index: number }) => (
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
  );

  // Componente de error
  const ErrorComponent = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500 mb-4 text-center">
        No pudimos cargar los productos. Por favor intenta nuevamente.
      </Text>
      <TouchableOpacity
        onPress={() => refetch()}
        className="bg-primary px-6 py-2 rounded-full"
      >
        <Text className="text-white font-medium">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header siempre visible */}
      <ListHeader
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedCategory={selectedCategory}
        filterSheetRef={filterSheetRef}
      />

      <FlatList
        data={!allProducts ? [] : [...allProducts]}
        ListEmptyComponent={isError ? ErrorComponent : null}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={
          isError
            ? undefined
            : { justifyContent: "space-between", paddingHorizontal: 16 }
        }
        renderItem={renderProduct}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
      />

      {/* BottomSheets */}
      <FilterSheet
        ref={filterSheetRef}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onApply={() => {}}
        onClear={() => setSelectedCategory("Todas las categorias")}
      />
    </View>
  );
}
