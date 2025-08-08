import { View, ScrollView, Button } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import {
  PackageOpen,
  Package,
  CircleDollarSign,
  MessageSquareMore,
  LayoutDashboard,
  ScrollText,
  Truck,
} from "lucide-react-native";
import HeaderVendor from "~/components/epic/headerVendor";
import { Separator } from "~/components/ui/separator";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useAuth } from "~/components/ContextProviders/AuthProvider";
import { useVendorAction } from "~/actions/vendor.action";
import { useBranchAction } from "~/actions/branch.action";
import { Branch } from "~/constants/models";
import { useBranchSelectedStore } from "~/store/branchSelectedStore";
import { useState } from "react";
import { Modal, FlatList, TouchableHighlight, Image } from "react-native";

export default function VendorHome() {
  const { user } = useAuth();
  const actions = useVendorAction();
  const vendorQuery = actions.getVendorById(user?.foreignPersonId);
  const branchActions = useBranchAction();
  const branchQuery = branchActions.getBranchesByVendorId(
    user?.foreignPersonId
  );
  const availableBranches = branchQuery.data?.data;
  const branchSelected = useBranchSelectedStore();

  const [modalVisible, setModalVisible] = useState(false);

  const showBranchSelector = () => {
    setModalVisible(true);
  };

  const handleSelectBranch = (branch: Branch) => {
    branchSelected.set(branch);
    setModalVisible(false);
  };

  const handleClearBranch = () => {
    branchSelected.clear();
    setModalVisible(false);
  };

  const stats = {
    orders: 12,
    history: 120,
    earnings: 250000,
    messages: 5,
    sales: 16,
  };

  const handleActiveOrders = () => {
    router.push("/orders?tab=activos");
  };

  const handlePendingOrders = () => {
    router.push("/orders?tab=pendientes");
  };

  const handleOrderHistory = () => {
    router.push("/orders?tab=historial");
  };
  const handleDashboard = () => {
    router.push("/(dashboard)/dashboard");
  };
  const handleMessages = () => {
    router.push("/chats");
  };

  // Shadow style for cards
  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  };
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              width: "80%",
              maxHeight: "60%",
            }}
          >
            <Text className="text-xl font-bold mb-4">
              Selecciona una sucursal
            </Text>
            <FlatList
              data={availableBranches || []}
              keyExtractor={(item: Branch) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableHighlight
                  underlayColor="#eee"
                  onPress={() => handleSelectBranch(item)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <View className="flex flex-row ">
                    <Image
                      source={{ uri: item?.logo }}
                      className="w-8 h-8 rounded-full"
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          branchSelected.branch?.id === item.id
                            ? "#35B675"
                            : "#222",
                        fontWeight:
                          branchSelected.branch?.id === item.id
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
            />
            <View className="flex-row justify-between mt-6">
              <Button onPress={handleClearBranch} title="Ninguna"></Button>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#DD6F9C", fontWeight: "bold" }}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView className="h-full w-full pt-4 mt-12">
        {vendorQuery.data !== undefined ? (
          <HeaderVendor
            user={vendorQuery.data}
            branch={branchSelected.branch}
            onBranchPress={showBranchSelector}
          />
        ) : (
          <></>
        )}
        <Separator />
        {!!branchSelected.branch ? (
          <>
            <View className="px-4 pb-4">
              <Text className="text-3xl font-bold text-black py-4">
                Indicadores del día
              </Text>
              <View className="flex-row gap-4 mb-6">
                <TouchableOpacity
                  style={{ flex: 1, aspectRatio: 1, ...cardShadow }}
                  onPress={handlePendingOrders}
                >
                  <View className="flex-1 rounded-2xl bg-[#FFD100] border-2 border-[#bfa100]">
                    <CardContent className="flex-1 flex-col justify-center px-4">
                      <View className="flex-row items-center mb-2">
                        <Package size={28} color="#000" />
                        <Text className="ml-2 text-base font-medium text-black">
                          Pedidos
                        </Text>
                      </View>
                      <Text className="text-2xl font-semibold text-black mb-1">
                        Pendientes
                      </Text>
                      <Text className="text-5xl font-extrabold text-black">
                        {stats.orders}
                      </Text>
                    </CardContent>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1, aspectRatio: 1, ...cardShadow }}
                  onPress={handleActiveOrders}
                >
                  <View className="flex-1 rounded-2xl bg-[#ffffff] border-2 border-[#666666]">
                    <CardContent className="flex-1 flex-col justify-center px-4">
                      <View className="flex-row items-center mb-2">
                        <Truck size={28} color="#666666" />
                        <Text className="ml-2 text-base font-medium text-[#666666]">
                          Pedidos
                        </Text>
                      </View>
                      <Text className="text-2xl font-semibold text-[#666666] mb-1">
                        Activos
                      </Text>
                      <Text className="text-5xl font-extrabold text-[#666666]">
                        2
                      </Text>
                    </CardContent>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="gap-4 mb-6">
                <TouchableOpacity onPress={handleOrderHistory}>
                  <View
                    className="rounded-2xl bg-[#ffffff] border-2 border-[#666666]"
                    style={cardShadow}
                  >
                    <CardContent className="px-4 py-2">
                      <View className="flex-row items-center mb-1">
                        <ScrollText size={20} color="#666666" />
                        <Text className="ml-2 text-base font-medium text-[#666666]">
                          Historial
                        </Text>
                      </View>
                      <Text className="text-2xl font-semibold text-[#666666]">
                        Ventas
                      </Text>
                      <Text className="text-4xl font-bold text-[#666666]">
                        {stats.history}
                      </Text>
                    </CardContent>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="gap-4 mb-4">
                <TouchableOpacity onPress={handleMessages}>
                  <View
                    className="rounded-2xl bg-[#ffffff] border-2 border-[#666666]"
                    style={cardShadow}
                  >
                    <CardContent className="px-4 py-2">
                      <View className="flex-row items-center mb-1">
                        <MessageSquareMore size={20} color="#666666" />
                        <Text className="ml-2 text-base font-medium text-[#666666]">
                          Mensajes
                        </Text>
                      </View>
                      <Text className="text-2xl font-semibold text-[#666666]">
                        No leídos
                      </Text>
                      <Text className="text-4xl font-bold text-[#666666]">
                        {stats.messages}
                      </Text>
                    </CardContent>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="px-4 ">
              <View
                className="rounded-2xl bg-[#35B675] border-2 border-[#218c4a] mb-4"
                style={cardShadow}
              >
                <CardContent className="p-4 flex-row items-center">
                  <CircleDollarSign size={28} color="#ffffff" />
                  <View className="ml-2 flex-1">
                    <Text className="text-base font-medium text-white">
                      Ventas del día
                    </Text>
                    <Text className="text-2xl font-bold text-white">
                      ${stats.earnings.toLocaleString()}{" "}
                      <Text className="text-base font-normal text-white">
                        ({stats.sales} ventas)
                      </Text>
                    </Text>
                  </View>
                </CardContent>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="px-4 pb-4">
              <Text className="text-3xl font-bold text-black py-4">
                Noo hay una tienda seleccionada aun
              </Text>
              <Button title="Escoger" onPress={showBranchSelector}></Button>
            </View>
          </>
        )}
        <Separator className="mb-4" />

        <View className="px-4 pb-4">
          <TouchableOpacity onPress={handleDashboard}>
            <View
              className="rounded-2xl bg-[#DD6F9C] border-2 border-[#B15B7D] mb-4"
              style={cardShadow}
            >
              <CardContent className="p-4 flex-row items-center">
                <LayoutDashboard size={28} color="#ffffff" />
                <View className="ml-2 flex-1">
                  <Text className="text-base font-medium text-white">
                    Administración
                  </Text>
                  <Text className="text-lg underline text-white">
                    Gestionar mi cuenta
                  </Text>
                </View>
              </CardContent>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
