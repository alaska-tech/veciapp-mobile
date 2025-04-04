import { View } from 'react-native';
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import HeaderHome from "../../components/epic/headerHome";
import CategoriesHome from '~/components/epic/categoriesHome';
import { ScrollView } from "react-native"

export default function HomeScreen() {
  return (
    <ScrollView className="h-full w-full p-4 mt-8">
      <HeaderHome />
      <CategoriesHome />
    </ScrollView>
  );
}