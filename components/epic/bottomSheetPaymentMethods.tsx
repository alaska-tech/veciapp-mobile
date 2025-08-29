import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { View, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { CreditCard, HandshakeIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ServiceOrderPaymentMethodType } from "~/constants/models";

export type PaymentMethodSheetRef = {
  show: () => void;
  hide: () => void;
};

type PaymentMethodSheetProps = {
  total: number;
  onSelectMethod: (
    closeModal: () => void,
    paymentMethod: ServiceOrderPaymentMethodType[number]
  ) => Promise<void>;
};

const PaymentMethodSheet = forwardRef<
  PaymentMethodSheetRef,
  PaymentMethodSheetProps
>(({ onSelectMethod }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedMethod, setSelectedMethod] = React.useState<
    ServiceOrderPaymentMethodType[number] | null
  >(null);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    show: () => sheetRef.current?.present(),
    hide: () => sheetRef.current?.forceClose(),
  }));

  const snapPoints = useMemo(() => ["50%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const handleMethodSelect = (
    method: ServiceOrderPaymentMethodType[number]
  ) => {
    setSelectedMethod(method);
  };

  const handleApply = async () => {
    if (selectedMethod) {
      await onSelectMethod?.(() => {
        sheetRef.current?.forceClose();
      }, selectedMethod);
      /*       router.push("/(customerscreens)/loadingScreen");
      setTimeout(() => {
        router.replace("/(customerscreens)/paymentResultScreen");
      }, 2000); */
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleStyle={{
        backgroundColor: "white",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}
      handleIndicatorStyle={{ backgroundColor: "#CCCCCC" }}
      style={{ backgroundColor: "white", borderRadius: 15 }}
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        <Text className="text-2xl font-bold mb-6">Método de pago</Text>
        <Text className="text-lg mb-6">Como quieres pagar</Text>

        <TouchableOpacity
          onPress={() => handleMethodSelect("transfer")}
          className={`flex-row items-center p-4 ${
            selectedMethod === "transfer" ? "bg-[#00563B]" : "bg-gray-100"
          } rounded-full mb-4`}
        >
          <CreditCard
            size={24}
            color={selectedMethod === "transfer" ? "white" : "#666666"}
          />
          <Text
            className={`${
              selectedMethod === "transfer" ? "text-white" : "text-gray-700"
            } text-lg ml-3 flex-1`}
          >
            Pagos en Línea - Wompi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleMethodSelect("cash")}
          className={`flex-row items-center p-4 ${
            selectedMethod === "cash" ? "bg-[#00563B]" : "bg-gray-100"
          } rounded-full`}
        >
          <HandshakeIcon
            size={24}
            color={selectedMethod === "cash" ? "white" : "#666666"}
          />
          <Text
            className={`${
              selectedMethod === "cash" ? "text-white" : "text-gray-700"
            } text-lg ml-3 flex-1`}
          >
            Pagar contraentrega - Efectivo
          </Text>
        </TouchableOpacity>

        <Button
          onPress={handleApply}
          className="mt-6 bg-yellow-400 rounded-full py-4 mb-4"
          size="lg"
          disabled={selectedMethod === null}
        >
          <Text className="text-black text-center font-semibold text-lg">
            Pagar
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PaymentMethodSheet;
