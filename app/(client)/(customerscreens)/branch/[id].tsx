import { ActivityIndicator, FlatList, View, Image } from "react-native";
import { Text } from "~/components/ui/text";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "~/components/epic/productCard";
import { Button } from "~/components/ui/button";
import { useProductAction } from "~/actions/product.action";
import { useBranchAction } from "~/actions/branch.action";
import React from "react";
import { Branch } from "~/constants/models";
import {
  Clock,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { WEEKDAY_LABEL, weekDayType } from "~/constants/labels";

const branchExample = {
  id: "5a9ed98e-a439-4f8c-8ae5-b2b535b94102",
  vendorId: "56c0f0ba-35aa-4103-84f8-61079a4b4b24",
  name: "Delicias Domingo",
  location: {
    type: "Point",
    coordinates: [-74.190294, 11.225966],
  },
  distance: 0,
  address: "Consolata Mz C Lt 9",
  country: "Colombia",
  city: "Santa Marta",
  rank: 0,
  isActive: false,
  state: "created",
  stateHistory: [
    {
      state: "created",
      reason: "Tienda del Veci-proveedor creada por primera vez",
      changedAt: "2025-07-23T14:45:15.069Z",
    },
  ],
  businessType: "individual",
  operatingHours: {
    friday: null,
    monday: ["02:30", "07:30"],
    sunday: null,
    tuesday: null,
    saturday: null,
    thursday: null,
    wednesday: null,
  },
  logo: "https://res.cloudinary.com/gijumi/image/upload/v1753385010/branches/logos/vah1ugx5ltsyu482cspr.jpg",
  managerName: "Farit Majul",
  managerPhone: "57 3008992753",
  images: [],
  isPickupAvailable: true,
  isDeliveryAvailable: true,
  availablePaymentMethods: [
    "Nequi",
    "Transfiya",
    "Efectivo",
    "Llaves",
    "Daviplata",
  ],
  description: "Las mejores comidas rapidas de cartagena",
  createdAt: "2025-07-23T14:45:15.104Z",
  updatedAt: "2025-07-24T19:23:31.253Z",
  productServices: [
    {
      id: "9b1fbc4c-ecbd-4e26-a218-e8b134cfcbc8",
      vendorId: "d967830a-00af-430b-abc5-a5233513a13c",
      branchId: "5a9ed98e-a439-4f8c-8ae5-b2b535b94102",
      categoryId: "Gastronomía",
      serviceScheduling: {
        availableHours: {},
      },
      type: "product",
      name: "salchipapa",
      description: "la mejor salchipapa de santa marta",
      shortDescription: "asd",
      price: "25000.00",
      discount: "0.00",
      finalPrice: "25000.00",
      currency: "COP",
      logo: null,
      images: [],
      mainImage: "https://url-imagen.com/imagen.jpg",
      tags: [],
      rank: 0,
      state: "available",
      inventory: 100,
      presentation: null,
      ingredients: [],
      allergens: [],
      isHighlighted: false,
      isBestseller: false,
      isNew: false,
      createdAt: "2025-07-30T19:58:36.563Z",
      updatedAt: "2025-07-30T19:58:36.563Z",
      createdBy:
        "vendor-56c0f0ba-35aa-4103-84f8-61079a4b4b24-faritmajul3112@hotmail.com",
      updatedBy: null,
      stateHistory: [
        {
          state: "created",
          reason: "Product/Service creado por primera vez",
          changedAt: "2025-07-30T19:58:36.248Z",
        },
      ],
      deleteDate: null,
    },
  ],
};
export default function HomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const branchAction = useBranchAction();
  const branchQuery = branchAction.getBranchById(id as string);
  const actions = useProductAction();
  const fetchProductsPage = actions.fetchProductsByBranchPaginated;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", "byBranchId", id],
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
  const ListHeader = () => <View className="p-4"></View>;

  return (
    <View className="flex-1">
      <FlatList
        ListHeaderComponent={<BranchHeader branch={branchQuery.data} />}
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
            key={item.id}
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

const BranchHeader = ({ branch }: { branch?: Branch }) => {
  if (!branch) {
    return (
      <View className="p-4">
        <ActivityIndicator />
      </View>
    );
  }

  const operatingHoursArray = Object.entries(branch.operatingHours || {})
    .map(([day, hours]) => ({ day, hours }))
    .filter((item) => item.hours !== null);
  return (
    <Card className="w-full overflow-hidden shadow-lg bg-white mb-8 ">
      <CardHeader className="p-0">
        <Image
          source={{ uri: branch.logo }}
          className="w-full h-48"
          resizeMode="cover"
        />
      </CardHeader>
      <CardContent className="pt-6 pb-3">
        <CardTitle className="text-3xl font-bold text-gray-900 ">
          {branch.name}
        </CardTitle>
        <Text className="text-base text-gray-600 ">{branch.description}</Text>

        <View className="flex-row items-center mb-4">
          <MapPin size={16} color="#6b7280" />
          <Text className="ml-2 text-base text-gray-700 ">
            {branch.address}, {branch.city}
          </Text>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Clock size={16} color="#6b7280" />
            <Text className="ml-2 text-base font-semibold text-gray-800 ">
              Horario de Atención
            </Text>
          </View>
          {operatingHoursArray.length > 0 ? (
            operatingHoursArray.map((item) => (
              <View
                key={item.day}
                className="flex-row justify-between items-center ml-6"
              >
                <Text className="capitalize text-gray-600 ">
                  {WEEKDAY_LABEL[item.day as weekDayType[number]]}
                </Text>
                <Text className="font-mono text-gray-800 ">
                  {item.hours?.join(" - ")}
                </Text>
              </View>
            ))
          ) : (
            <Text className="ml-6 text-gray-500 ">No disponible</Text>
          )}
        </View>

        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <CreditCard size={16} color="#6b7280" />
            <Text className="ml-2 text-base font-semibold text-gray-800 ">
              Métodos de Pago
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2 ml-6">
            {branch.availablePaymentMethods.map((method) => (
              <Badge key={method} variant="outline" className="px-3 py-1">
                <Text className="text-gray-700 ">{method}</Text>
              </Badge>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <PackageCheck size={16} color="#6b7280" />
            <Text className="ml-2 text-base font-semibold text-gray-800 ">
              Opciones de entrega
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2 ml-6">
            {branch.isDeliveryAvailable ? (
              <Badge key={"Domicilio"} variant="outline" className="px-3 py-1">
                <Text className="text-gray-700 ">{"Domicilio"}</Text>
              </Badge>
            ) : (
              <></>
            )}
            {branch.isPickupAvailable ? (
              <Badge
                key={"Recogida en tienda"}
                variant="outline"
                className="px-3 py-1"
              >
                <Text className="text-gray-700 ">{"Recogida en tienda"}</Text>
              </Badge>
            ) : (
              <></>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
};
