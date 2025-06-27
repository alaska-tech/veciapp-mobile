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
        <Minus size={20} color={quantity <= min ? '#ccc' : '#222'} />
      </TouchableOpacity>
      <Text className="mx-4 text-lg">{quantity}</Text>
      <TouchableOpacity
        onPress={() => setQuantity(Math.min(max, quantity + 1))}
        className="p-2"
        disabled={quantity >= max}
      >
        <Plus size={20} color={quantity >= max ? '#ccc' : '#222'} />
      </TouchableOpacity>
    </View>
  );
}

const Product = () => {
  const { id } = useLocalSearchParams();
  const actions = useProductAction();
  const productQuery = actions.getProductById(id as string);
  const [quantity, setQuantity] = useState(1);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const cartItems = useCartStore((state) => state.cartItems);
  const router = useRouter();
  const addFavorite = useFavoriteStore((state) => state.addFavorite);
  const favorites = useFavoriteStore((state) => state.favorites);

  if (productQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }

  // Usar datos reales del producto
  const product = productQuery.data as any || {};
  const productData = product.data || {};
  const validFavorites = favorites.filter(fav => fav && typeof fav === 'object' && fav.id);
  const isFavorite = validFavorites.some(
    (fav) => fav.id === (productData.id || productData.name)
  );

  // Vendor y reviews pueden venir del producto si existen, si no, usar valores por defecto
  const vendor = product.vendor || {
    name: "Tierra Viva",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  };
  const reviews = product.reviews || [
    {
      name: "Laura Gutiérrez",
      rating: 5,
      commentTitle: "¡Huele delicioso y deja la piel suave!",
      comment:
        "Me encantó el aroma natural y cómo deja la piel después de usarlo. Se nota que está hecho con amor. Repetiré sin duda.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Elkin Márquez",
      rating: 5,
      commentTitle: "Excelente calidad",
      comment: "Muy buen producto, recomendado.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  // Usar datos reales si existen, si no, valores por defecto
  const rating = product.rating ?? 0;
  const ratingCount = product.ratingCount ?? 0;
  const distance = product.distance ?? "1.5Km";
  const available = product.inventory ?? 6;
  const discount = product.discount ?? 0;
  const price = product.finalPrice ?? product.price ?? 0;
  const oldPrice = product.price && product.finalPrice ? product.price : undefined;
  const category = product.categoryName ?? "Belleza";
  const description =
    product.description ||
    "Disfruta de la suavidad y el aroma tropical con nuestro jabón artesanal de coco y miel, elaborado con ingredientes 100% naturales. Su fórmula hidratante nutre la piel, dejando una sensación sedosa y fresca. Perfecto para todo tipo de piel, especialmente seca o sensible.";
  const benefits = product.benefits || [
    "Hidratación profunda gracias al aceite de coco.",
    "Propiedades antibacterianas y regeneradoras de la miel.",
    "Sin químicos agresivos ni parabenos.",
    "Aroma dulce y relajante.",
  ];
  const presentation = product.presentation || "100g";

  // Handler para agregar al carrito y navegar
  const handleAddToCart = () => {
    // Buscar si el producto ya está en el carrito por nombre (puedes cambiar a id si lo tienes)
    const existingIndex = cartItems.findIndex((item: any) => item.name === product.name);
    if (existingIndex !== -1) {
      // Si ya existe, sumar la cantidad (esto podría mejorarse con una acción updateCartItemQuantity)
      // Aquí solo agregamos como nuevo para mantener la lógica simple
    }
    addCartItem({
      name: product.name,
      price: price,
      image: product.mainImage || '',
      quantity: quantity,
    });
    router.push('/(client)/(tabs)/cart');
  };

  // Handler para agregar a favoritos
  const handleAddFavorite = () => {
    console.log('Intentando agregar a favoritos:', productData);
    if (!productData || (!productData.id && !productData.name)) return;
    console.log('Agregando a favoritos:', {
      id: productData.id || productData.name,
      name: productData.name,
      price: productData.finalPrice || productData.price,
      image: productData.mainImage || 'https://picsum.photos/200',
      discount: productData.discount,
      veciproveedor: vendor.name,
    });
    addFavorite({
      id: productData.id || productData.name,
      name: productData.name,
      price: productData.finalPrice || productData.price,
      image: productData.mainImage || 'https://picsum.photos/200',
      discount: productData.discount,
      veciproveedor: vendor.name,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header: Imagen, favoritos, compartir */}
          <View className="relative">
            <Image
              source={{ uri: product.mainImage || 'https://picsum.photos/400' }}
              className="w-[92%] self-center h-64 rounded-2xl mt-2"
              resizeMode="cover"
            />
            <View className="absolute top-4 right-4 flex-row gap-2">
              <TouchableOpacity className="bg-white/80 rounded-full p-2 mr-2" onPress={handleAddFavorite}>
                <Heart size={22} color={isFavorite ? 'red' : '#222'} />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/80 rounded-full p-2 mr-2">
                <Share2 size={22} color="#222" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info principal */}
          <View className="px-4 mt-4">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-2xl font-bold flex-1">{product.name || 'Jabón Artesanal de Coco y Miel'}</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              {oldPrice && (
                <Text className="text-lg text-gray-400 line-through mr-2">${oldPrice.toLocaleString()}</Text>
              )}
              <Text className="text-2xl font-bold">${price.toLocaleString()}</Text>
              {discount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-yellow-100 rounded-full px-3 py-1 self-start">
                  <Text className="text-yellow-700">-{discount}%</Text>
                </Badge>
              )}
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <Star size={18} color="#FFD700" fill="#FFD700" />
              <Text className="text-lg font-semibold">{rating}</Text>
              <Text className="text-gray-500">({ratingCount})</Text>
              <MapPin size={16} color="#666" />
              <Text className="text-gray-500">{distance} de distancia</Text>
            </View>
            <View className="flex-row items-center gap-2 mb-2">
              <QuantityControl quantity={quantity} setQuantity={setQuantity} max={available} min={1} />
              <Text className="ml-4 text-gray-500">{available} Disponibles</Text>
            </View>
            <Badge variant="secondary" className="rounded-full px-3 py-1 self-start bg-pink-200">
              <Text className="text-pink-700">{category}</Text>
            </Badge>
          </View>

          {/* Proveedor */}
          <View className="flex-row items-center px-4 mt-4 mb-2">
            <Image source={{ uri: vendor.image }} className="w-8 h-8 rounded-full mr-2" />
            <Text className="font-bold text-lg">{vendor.name}</Text>
            <Button className="ml-auto bg-blue-500 px-4 py-1 rounded-full" size="sm"><Text className="text-white">Ver tienda</Text></Button>
          </View>

          {/* Descripción */}
          <View className="px-4 mt-2">
            <Text className="text-xl font-bold mb-1">Descripción</Text>
            <Text className="text-gray-700 mb-2">{description}</Text>
            <Text className="text-lg font-bold mt-2">Beneficios</Text>
            {benefits.map((b: any, i: number) => (
              <Text key={i} className="text-gray-600 ml-2 mb-1">• {b}</Text>
            ))}
            <Text className="text-lg font-bold mt-2">Presentación</Text>
            <Text className="text-gray-700 mb-2">{presentation}</Text>
          </View>

          {/* Opiniones */}
          <View className="px-4 mt-4">
            <Text className="text-xl font-bold mb-2">Opiniones del producto</Text>
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl font-bold mr-2">{rating}</Text>
              <Star size={22} color="#FFD700" fill="#FFD700" />
              <Text className="text-gray-500 ml-2">{ratingCount} calificaciones</Text>
            </View>
            {reviews.map((review: any, i: number) => (
              <View key={i} className="mb-4">
                <View className="flex-row items-center mb-1">
                  <Image source={{ uri: review.avatar }} className="w-8 h-8 rounded-full mr-2" />
                  <Text className="font-bold">{review.name}</Text>
                  <Text className="ml-2 text-yellow-600">{review.rating} <Star size={16} color="#FFD700" fill="#FFD700" /></Text>
                </View>
                <Text className="font-bold mb-1">{review.commentTitle}</Text>
                <Text className="text-gray-700 mb-1">{review.comment}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* Botón fijo */}
        <View className="absolute left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200">
          <Button className="w-full bg-yellow-400 rounded-full py-4" onPress={handleAddToCart}>
            <Text className="text-black font-bold text-xl">¡Lo quiero!</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Product;
