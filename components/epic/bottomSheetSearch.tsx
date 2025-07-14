import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export type SearchOrderSheetRef = {
  show: () => void;
  hide: () => void;
};

type SearchOrderSheetProps = {
  selectedOrder: string;
  onSelectOrder?: (order: string) => void;
  onApply?: () => void;
};

const orderOptions = [
  'Cerca de mi',
  'Mejor calificado',
];

const SearchOrderSheet = forwardRef<SearchOrderSheetRef, SearchOrderSheetProps>(({ selectedOrder, onSelectOrder, onApply }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [localSelected, setLocalSelected] = React.useState<string>(selectedOrder);

  useImperativeHandle(ref, () => ({
    show: () => sheetRef.current?.present(),
    hide: () => sheetRef.current?.forceClose(),
  }));

  React.useEffect(() => {
    setLocalSelected(selectedOrder);
  }, [selectedOrder]);

  const snapPoints = useMemo(() => ['50%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const handleOrderSelect = (order: string) => {
    setLocalSelected(order);
    onSelectOrder?.(order);
  };

  const handleApply = () => {
    onApply?.();
    sheetRef.current?.forceClose();
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
        <Text className="text-xl font-bold mb-6 text-center">Resultado de busqueda</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 16 }} />
        <Text className="text-base font-semibold mb-3">Ordenar por</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 24 }}>
          {orderOptions.map((order) => (
            <TouchableOpacity
              key={order}
              onPress={() => handleOrderSelect(order)}
              style={{
                backgroundColor: localSelected === order ? '#00563B' : '#F3F4F6',
                borderRadius: 9999,
                paddingVertical: 14,
                paddingHorizontal: 20,
                marginRight: 12,
                marginBottom: 12,
                minWidth: 180,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: localSelected === order ? 'white' : '#222', fontWeight: 'bold', fontSize: 17 }}>{order}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          onPress={handleApply}
          className="bg-yellow-400 rounded-full py-4 mb-4"
          size="lg"
        >
          <Text className="text-black text-center font-semibold text-lg">
            Aplicar
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default SearchOrderSheet;
