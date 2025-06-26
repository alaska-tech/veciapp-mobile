import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MapPin } from "lucide-react-native";

export type LocationSheetRef = {
  show: () => void;
  hide: () => void;
};

type LocationSheetProps = {
  onSave?: (address: string) => void;
  defaultAddress?: string;
};

const LocationSheet = forwardRef<LocationSheetRef, LocationSheetProps>(({ onSave, defaultAddress }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [address, setAddress] = useState(defaultAddress || '');

  useImperativeHandle(ref, () => ({
    show: () => sheetRef.current?.present(),
    hide: () => sheetRef.current?.forceClose(),
  }));

  const snapPoints = useMemo(() => ['50%'], []);
  
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const handleSave = () => {
    onSave?.(address);
    sheetRef.current?.forceClose();
  };

  const handleUseCurrentLocation = () => {
    // Implement location permission and getting current location
    console.log("Getting current location...");
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleStyle={{ backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
      handleIndicatorStyle={{ backgroundColor: '#CCCCCC' }}
      style={{ backgroundColor: 'white', borderRadius: 15 }}
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        <Text className="text-xl font-bold mb-4">Actualiza tu dirección</Text>
        
        <Text className="text-gray-600 mb-2">Dirección actual</Text>
        
        <View className="relative mb-4">
          <Input
            value={address}
            onChangeText={setAddress}
            placeholder="Calle 123 # 45 - 67"
            className="pl-12 py-3 text-base rounded-full border border-gray-400"
          />
          <View className="absolute left-4 top-3">
            <MapPin size={20} color="#666666" />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleUseCurrentLocation}
          className="flex-row items-center mb-6"
        >
          <MapPin size={20} color="#3B82F6" />
          <Text className="text-blue-500 ml-2">Usar mi ubicación actual</Text>
        </TouchableOpacity>

        <Button
          onPress={handleSave}
          className="bg-yellow-400 rounded-full py-4 mb-4"
          size="lg"
        >
          <Text className="text-black text-center font-semibold text-base">
            Guardar dirección
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default LocationSheet;