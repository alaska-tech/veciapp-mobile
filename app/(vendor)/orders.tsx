import { View, ScrollView } from "react-native";
import { useVendorAction } from "~/actions/vendor.action";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import HeaderVendor from "~/components/epic/headerVendor";
import VendorTabs from "~/components/epic/vendorTabs";
import { Separator } from "~/components/ui/separator";

export default function OrdersScreen() {
  const { user } = useAuth();
  const actions = useVendorAction();
  const vendorQuery = actions.getVendorById(user?.foreignPersonId);
  return (
    <ScrollView className="h-full w-full pt-4 mt-12">
      {vendorQuery.data !== undefined ? (
        <HeaderVendor user={vendorQuery.data} />
      ) : (
        <></>
      )}
      <Separator />
      <VendorTabs />
    </ScrollView>
  );
}
