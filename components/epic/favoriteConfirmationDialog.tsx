import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Text } from '~/components/ui/text';
import { Heart } from 'lucide-react-native';

interface FavoriteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  action?: 'add' | 'remove';
}

export const FavoriteConfirmationDialog: React.FC<FavoriteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  productName = 'Producto',
  action = 'add',
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  const isAdd = action === 'add';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-2xl p-6 max-w-sm mx-4">
        <DialogHeader className="items-center">
          <View className={`rounded-full p-3 mb-4 ${isAdd ? 'bg-red-100' : 'bg-gray-200'}`}>
            <Heart size={32} color={isAdd ? 'red' : '#888'} fill={isAdd ? 'red' : 'none'} />
          </View>
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            {isAdd ? '¡Agregado a favoritos!' : 'Eliminado de favoritos'}
          </DialogTitle>
        </DialogHeader>
        <View className="items-center">
          <Text className="text-center text-gray-600 text-base">
            {isAdd
              ? `"${productName}" ha sido agregado a tu lista de favoritos`
              : `"${productName}" ha sido eliminado de tu lista de favoritos`}
          </Text>
        </View>
      </DialogContent>
    </Dialog>
  );
}; 