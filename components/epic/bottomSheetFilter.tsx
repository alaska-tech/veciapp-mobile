import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export type FilterSheetRef = {
  show: () => void;
  hide: () => void;
};

type FilterSheetProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory?: (category: string) => void;
  onClear?: () => void;
  onApply?: () => void;
};

const FilterSheet = forwardRef<FilterSheetRef, FilterSheetProps>(({ categories, selectedCategory, onSelectCategory, onClear, onApply }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [localSelected, setLocalSelected] = React.useState<string>(selectedCategory);

  useImperativeHandle(ref, () => ({
    show: () => sheetRef.current?.present(),
    hide: () => sheetRef.current?.forceClose(),
  }));

  React.useEffect(() => {
    setLocalSelected(selectedCategory);
  }, [selectedCategory]);

  const snapPoints = useMemo(() => ['70%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const handleCategorySelect = (cat: string) => {
    setLocalSelected(cat);
    onSelectCategory?.(cat);
  };

  const handleClear = () => {
    setLocalSelected('Todas las categorias');
    onClear?.();
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text className="text-xl font-bold">Todos los filtros</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text className="text-base text-gray-500 font-semibold">Limpiar</Text>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 16 }} />
        <Text className="text-base font-semibold mb-3">Buscar en</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 24 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => handleCategorySelect(cat)}
              style={{
                backgroundColor: localSelected === cat ? '#00563B' : '#F3F4F6',
                borderRadius: 9999,
                paddingVertical: 14,
                paddingHorizontal: 20,
                marginRight: 12,
                marginBottom: 12,
                minWidth: 160,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: localSelected === cat ? 'white' : '#E5E7EB',
                marginRight: 10,
                borderWidth: 2,
                borderColor: localSelected === cat ? '#00563B' : '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
              }} />
              <Text style={{ color: localSelected === cat ? 'white' : '#222', fontWeight: 'bold', fontSize: 17 }}>{cat}</Text>
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

export default FilterSheet;
