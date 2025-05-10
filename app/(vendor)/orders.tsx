import { View, ScrollView } from "react-native";
import HeaderVendor from "~/components/epic/headerVendor";
import VendorTabs from "~/components/epic/vendorTabs";
import { Separator } from "~/components/ui/separator";

export default function OrdersScreen() {
  return (
    <ScrollView className="h-full w-full pt-4 mt-12">
      <HeaderVendor />
      <Separator />
      <VendorTabs />
    </ScrollView>
  );
}
