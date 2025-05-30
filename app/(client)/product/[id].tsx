import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductAction } from "~/actions/product.action";

const Product = () => {
  const { id } = useLocalSearchParams();
  const actions = useProductAction();
  const productQuery = actions.getProductById(id as string);
  if (productQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }
  return (
    <SafeAreaView>
      <Text>Product {JSON.stringify(productQuery.data)}</Text>
    </SafeAreaView>
  );
};

export default Product;
