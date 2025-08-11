import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductAction } from "~/actions/product.action";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Star, MapPin, Plus, Minus, Heart, Share2 } from "lucide-react-native";
import { useCartStore } from "~/store/cartStore";
import { useRouter } from "expo-router";
import { useFavoriteStore } from "~/store/favoriteStore";
import { FavoriteItem, Product } from "~/constants/models";
import { useBranchAction } from "~/actions/branch.action";
import { FavoriteConfirmationDialog } from "~/components/epic/favoriteConfirmationDialog";
import { useAuth } from "~/components/ContextProviders/AuthProvider";

// Componente reutilizable para sumar/restar cantidad
function QuantityControl({
  quantity,
  setQuantity,
  max = 99,
  min = 1,
}: {
  quantity: number;
  setQuantity: (q: number) => void;
  max?: number;
  min?: number;
}) {
  return (
    <View className="flex-row items-center border border-gray-200 rounded-full px-2 py-1">
      <TouchableOpacity
        onPress={() => setQuantity(Math.max(min, quantity - 1))}
        className="p-2"
        disabled={quantity <= min}
      >
        <Minus size={20} color={quantity <= min ? "#ccc" : "#222"} />
      </TouchableOpacity>
      <Text className="mx-4 text-lg">{quantity}</Text>
      <TouchableOpacity
        onPress={() => setQuantity(Math.min(max, quantity + 1))}
        className="p-2"
        disabled={quantity >= max}
      >
        <Plus size={20} color={quantity >= max ? "#ccc" : "#222"} />
      </TouchableOpacity>
    </View>
  );
}

const Index = () => {
  // TODOS los hooks deben ir aquí arriba
  const { id } = useLocalSearchParams();
  const { user } = useAuth()
  const actions = useProductAction();
  const productQuery = actions.getProductById(id as string);
  const [quantity, setQuantity] = useState(1);
  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false);
  const [favoriteAction, setFavoriteAction] = useState<"add" | "remove">("add");
  const addCartItem = useCartStore((state) => state.addCartItem);
  const cartItems = useCartStore((state) => state.cartItems);
  const router = useRouter();
  const { addFavorite, isFavorite } = useFavoriteStore();
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const favorites = useFavoriteStore((state) => state.favorites);
  const branchActions = useBranchAction();
  const { data: branchData } = branchActions.getBranchById(
    productQuery.data?.branchId
  );
  const isThisFavorite = isFavorite(id as string);
  if (productQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }
  const {
    logo = "https://picsum.photos/400",
    name = "",
    rating = "",
    distance = "",
    state = "",
    discount = "",
    price = "",
    finalPrice = "",
    categoryId = "",
    description = "",
    inventory,
    id: productServiceId,
  } = productQuery.data || ({} as Product);
  const validFavorites = favorites.filter(
    (fav) => fav && typeof fav === "object" && fav.id
  );

  // Handler para agregar al carrito y navegar
  const handleAddToCart = () => {
    // Buscar si el producto ya está en el carrito por nombre (puedes cambiar a id si lo tienes)
    const existingIndex = cartItems.findIndex(
      (item: any) => item.name === name
    );
    if (existingIndex !== -1) {
      // Si ya existe, sumar la cantidad (esto podría mejorarse con una acción updateCartItemQuantity)
      // Aquí solo agregamos como nuevo para mantener la lógica simple
    }
    addCartItem({
      name: name,
      price: Number.parseFloat(finalPrice),
      image: logo,
      quantity: quantity,
      productServiceId,
    });
    router.push("/(client)/(tabs)/cart");
  };

  // Handler para alternar favorito
  const handleAddFavorite = () => {
    if (!productQuery.data || (!productServiceId && !name)) return;
    if (isThisFavorite) {
      removeFavorite(productServiceId);
      setFavoriteAction("remove");
      setShowFavoriteDialog(true);
    } else {
      const newItem: FavoriteItem = {
        productServiceId: productServiceId,
        userId: user?.foreignPersonId!,
        productService: productQuery.data
      };
      addFavorite(newItem);
      setFavoriteAction("add");
      setShowFavoriteDialog(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* <Text>{JSON.stringify(productQuery.data, null, 4)}</Text> */}
          <View className="relative">
            <Image
              source={{ uri: logo }}
              className="w-[92%] self-center h-64 rounded-2xl mt-2"
              resizeMode="cover"
            />
            <View className="absolute top-4 right-4 flex-row gap-2">
              <TouchableOpacity
                className="bg-white/80 rounded-full p-2 mr-2"
                onPress={handleAddFavorite}
              >
                <Heart
                  size={22}
                  color={isThisFavorite ? "red" : "#222"}
                  fill={isThisFavorite ? "red" : "none"}
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/80 rounded-full p-2 mr-2">
                <Share2 size={22} color="#222" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info principal */}
          <View className="px-4 mt-4">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-2xl font-bold flex-1">{name || ""}</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              {discount !== "0.00" ? (
                <Text className="text-lg text-gray-400 line-through mr-2">
                  ${price.toLocaleString()}
                </Text>
              ) : (
                <></>
              )}
              <Text className="text-2xl font-bold">
                ${finalPrice.toLocaleString()}
              </Text>
              {discount !== "0.00" ? (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-yellow-100 rounded-full px-3 py-1 self-start"
                >
                  <Text className="text-yellow-700">-{discount}</Text>
                </Badge>
              ) : (
                <></>
              )}
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Star size={18} color="#FFD700" fill="#FFD700" />
              <Text className="text-lg font-semibold">{rating}</Text>
              <MapPin size={16} color="#666" />
              <Text className="text-gray-500">{distance} de distancia</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <QuantityControl
                quantity={quantity}
                setQuantity={setQuantity}
                max={inventory}
                min={1}
              />
              <Text className="ml-4 text-gray-500">
                {inventory} Disponibles
              </Text>
            </View>
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 self-start bg-pink-200"
            >
              <Text className="text-pink-700">{categoryId}</Text>
            </Badge>
          </View>

          <View className="flex-row items-center px-4 mt-4 mb-2">
            <Image
              source={{ uri: branchData?.logo || "" }}
              className="w-8 h-8 rounded-full mr-2"
            />
            <Text className="font-bold text-lg">{branchData?.name || ""}</Text>
            <Button
              className="ml-auto bg-blue-500 px-4 py-1 rounded-full"
              size="sm"
            >
              <Text className="text-white">Ver tienda</Text>
            </Button>
          </View>
          <View className="px-4 mt-2">
            <Text className="text-xl font-bold mb-1">Descripción</Text>
            <Text className="text-gray-700 mb-2">{description}</Text>
          </View>
          <View className="absolute left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200">
            <Button
              className="w-full bg-yellow-400 rounded-full py-4"
              onPress={handleAddToCart}
            >
              <Text className="text-black font-bold text-xl">¡Lo quiero!</Text>
            </Button>
          </View>
        </ScrollView>
        <FavoriteConfirmationDialog
          open={showFavoriteDialog}
          onOpenChange={setShowFavoriteDialog}
          productName={name}
          action={favoriteAction}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
