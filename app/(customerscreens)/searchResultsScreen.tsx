import React, { useRef, useState, useMemo } from 'react';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Keyboard } from 'react-native';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Search } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import FilterSheet, { FilterSheetRef } from '~/components/epic/bottomSheetFilter';
import SearchOrderSheet, { SearchOrderSheetRef } from '~/components/epic/bottomSheetSearch';
import ProductCard from '~/components/epic/productCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useProductAction } from '~/actions/product.action';
import { useParameters } from '~/components/ContextProviders/ParametersProvider';

const categories = ['Todas las categorias', 'Gastronomía', 'Belleza', 'Confecciones'];
const orderOptions = ['Relevancia', 'Cerca de mi', 'Mejor calificado'];

// ListHeader fuera del cuerpo principal
function ListHeader({
  searchText,
  setSearchText,
  selectedTab,
  setSelectedTab,
  selectedCategory,
  filterSheetRef,
  selectedOrder,
  orderSheetRef,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedCategory: string;
  filterSheetRef: React.RefObject<any>;
  selectedOrder: string;
  orderSheetRef: React.RefObject<any>;
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
          <TabsTrigger value="productos" className="flex-1 rounded-md px-2"><Text>Productos</Text></TabsTrigger>
          <TabsTrigger value="servicios" className="flex-1 rounded-md px-2"><Text>Servicios</Text></TabsTrigger>
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
        <TouchableOpacity onPress={() => orderSheetRef.current?.show()}>
          <View>
            <Text className="text-gray-600">Ordenar por:</Text>
            <Text className="text-base font-medium">{selectedOrder} ▼</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const filterSheetRef = useRef<FilterSheetRef>(null);
  const orderSheetRef = useRef<SearchOrderSheetRef>(null);

  // Estados de filtros y búsqueda
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState('productos');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorias');
  const [selectedOrder, setSelectedOrder] = useState('Cerca de mi');

  // Lógica de productos (puedes adaptar para servicios si tienes endpoint)
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
    queryKey: ['products'],
    queryFn: fetchProductsPage,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.meta.page + 1;
      const totalPages = lastPage.data.meta.lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });

  // Filtrado local (puedes adaptar para servicios)
  const allProducts = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.data.data) || [];
    return items.filter((item: any) => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas las categorias' || item.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchText, selectedCategory]);

  // Ordenamiento local (puedes adaptar para servicios)
  const sortedProducts = useMemo(() => {
    if (selectedOrder === 'Cerca de mi') {
      return [...allProducts].sort((a: any, b: any) => (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0));
    } else if (selectedOrder === 'Mejor calificado') {
      return [...allProducts].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    }
    return allProducts;
  }, [allProducts, selectedOrder]);

  // Placeholder para servicios (puedes implementar lógica similar si tienes endpoint)
  const allServices: any[] = [];

  // Renderizado de cada producto/servicio
  const renderProduct = ({ item, index }: { item: any; index: number }) => (
    <View className="mb-4 w-[48%]" style={{ marginTop: index % 2 === 0 ? -16 : 16 }}>
      <ProductCard
        title={item.name}
        price={Number.parseFloat(item.price)}
        distance={item.distance || ''}
        rating={item.rating}
        category={item.categoryId}
        imageUrl={item.mainImage || ''}
        discount={Number.parseFloat(item.discount)}
        onPress={() => {
          router.push({ pathname: '/(client)/product/[id]', params: { id: item.id } });
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
      <TouchableOpacity onPress={() => refetch()} className="bg-primary px-6 py-2 rounded-full">
        <Text className="text-white font-medium">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Resultado de busqueda', headerShown: true, headerTitleAlign: 'center', headerBackTitle: 'Volver' }} />
      
      {/* Header siempre visible */}
      <ListHeader
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedCategory={selectedCategory}
        filterSheetRef={filterSheetRef}
        selectedOrder={selectedOrder}
        orderSheetRef={orderSheetRef}
      />
      
      {/* Contenido según tab */}
      {selectedTab === 'productos' ? (
        <FlatList
          data={isError ? [] : sortedProducts}
          ListEmptyComponent={isError ? ErrorComponent : null}
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          columnWrapperStyle={isError ? undefined : { justifyContent: 'space-between', paddingHorizontal: 16 }}
          renderItem={renderProduct}
          onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-400 text-center">No hay servicios disponibles aún. julian angulo mapear los que seán servicios aquí</Text>
        </View>
      )}
      
      {/* BottomSheets */}
      <FilterSheet
        ref={filterSheetRef}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onApply={() => {}}
        onClear={() => setSelectedCategory('Todas las categorias')}
      />
      <SearchOrderSheet
        ref={orderSheetRef}
        selectedOrder={selectedOrder}
        onSelectOrder={setSelectedOrder}
        onApply={() => {}}
      />
    </View>
  );
}
