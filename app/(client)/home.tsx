import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import HeaderHome from "../../components/epic/headerHome";
import CategoriesHome from "~/components/epic/categoriesHome";
import ColumnCard from "~/components/epic/columnCard";
import PromoCard from "~/components/epic/promoCard";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView className="h-full w-full p-4 mt-12 mb-12">
      <HeaderHome />
      <CategoriesHome />
      <ColumnCard />
      <PromoCard
        title="¡Tremendo Papayazo!"
        subtitle="Solo por hoy"
        buttonText="Aprovecha de una"
        image={require("../../assets/images/beauty.png")}
        onPress={() => { router.push("/(client)/cart") }}
      />
      <ColumnCard />
    </ScrollView>
  );
}
