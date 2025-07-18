import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Text } from '~/components/ui/text';
import { Heart } from 'lucide-react-native';

interface FavoriteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

export const FavoriteConfirmationDialog: React.FC<FavoriteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  productName = 'Producto'
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-2xl p-6 max-w-sm mx-4">
        <DialogHeader className="items-center">
          <View className="bg-red-100 rounded-full p-3 mb-4">
            <Heart size={32} color="red" fill="red" />
          </View>
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            ¡Agregado a favoritos!
          </DialogTitle>
        </DialogHeader>
        <View className="items-center">
          <Text className="text-center text-gray-600 text-base">
            "{productName}" ha sido agregado a tu lista de favoritos
          </Text>
        </View>
      </DialogContent>
    </Dialog>
  );
}; 