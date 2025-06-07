import { ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Stack } from "expo-router";
import React from "react";
import FavoriteCard from "~/components/epic/favoriteCard";

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Arepas Rellenas de Carne y Queso y mondaaaaaa",
      price: 20000,
      image: "https://picsum.photos/200",
      discount: 20,
      veciproveedor: "Erica Madeleine Soto",
    },
    {
      id: 2,
      name: "Bandeja Paisa Tradicional",
      price: 25000,
      image: "https://picsum.photos/200",
      veciproveedor: "Juan Pérez",
    },
    {
      id: 3,
      name: "Cazuela de Mariscos",
      price: 35000,
      image: "https://picsum.photos/200",
      discount: 10,
      veciproveedor: "María Gómez",
    },
    {
      id: 4,
      name: "Patacón con Hogao",
      price: 15000,
      image: "https://picsum.photos/200",
      discount: 25,
      veciproveedor: "Carlos Ramírez",
    },
  ]);

  const handleDelete = (id: number) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: "Mis favoritos",
          headerTitleAlign: "center",
          headerShown: true,
          headerBackVisible: true, 
        }}
      />
      <ScrollView className="h-full w-full p-4">
        {favorites.map((item) => (
          <FavoriteCard
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            discount={item.discount}
            veciproveedor={item.veciproveedor}
            onDelete={() => handleDelete(item.id)}
            onWantIt={() => {
              // Handle "Lo quiero" action
              console.log('Want to buy:', item.name);
            }}
          />
        ))}
      </ScrollView>
    </>
  );
}
