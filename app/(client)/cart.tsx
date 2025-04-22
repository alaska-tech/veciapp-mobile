import { ScrollView } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useRouter } from "expo-router";
import CartCard from "~/components/epic/cartCard";

export default function CartScreen() {
  const router = useRouter();
  return (
    <ScrollView className="h-full w-full p-4 mt-12 mb-12">
      <CartCard
        providerName="Sabores de Santa Marta"
        providerImage="https://picsum.photos/200"
        distance="1.2Km"
        items={[
          {
            name: "Arroz con Coco Tradicional (Porción)",
            price: 15000,
            image: "https://picsum.photos/200",
            quantity: 1,
          },
          {
            name: "Tostadas de Pescado Frito",
            price: 22000,
            image: "https://picsum.photos/200",
            quantity: 1,
          },
        ]}
        subtotal={37000}
        serviceCharge={3700}
        deliveryFee={10000}
        total={50700}
        onQuantityChange={(index, quantity) => {}}
        onDelete={(index) => {}}
        onPayPress={() => {}}
      />
    </ScrollView>
  );
}
