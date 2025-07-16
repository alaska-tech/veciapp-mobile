import { View, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Trash2, Plus, Minus, MapPin, ChevronUp, ChevronDown } from 'lucide-react-native';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { useRef, useState } from "react";

interface CartCardProps {
  providerName: string;
  providerImage: string | ImageSourcePropType;
  distance: string;
  items: Array<{
    name: string;
    price: number;
    image: string | ImageSourcePropType;
    quantity: number;
  }>;
  subtotal: number;
  serviceCharge: number;
  deliveryFee: number;
  total: number;
  onQuantityChange?: (itemIndex: number, newQuantity: number) => void;
  onDelete?: (itemIndex: number) => void;
  onPayPress?: () => void;
}

// Add to imports
import PaymentMethodSheet, { PaymentMethodSheetRef } from './bottomSheetPaymentMethods';

export default function CartCard({
  providerName,
  providerImage,
  distance,
  items,
  subtotal = 0,  // Add default values
  serviceCharge = 0,
  deliveryFee = 0,
  total = 0,
  onQuantityChange,
  onDelete,
  onPayPress
}: CartCardProps) {
  // Add a helper function to safely format numbers
  const formatPrice = (price: number | undefined) => {
    return (price || 0).toLocaleString();
  };

  const [isOpen, setIsOpen] = React.useState(false);

  // Add this ref
  const paymentSheetRef = useRef<PaymentMethodSheetRef>(null);

  // Add this handler
  const handlePaymentMethodSelect = (method: 'online' | 'cash') => {
    console.log('Selected payment method:', method);
    onPayPress?.();
  };

  return (
    <Card className="rounded-3xl overflow-hidden">
      {/* Provider Info Section */}
      <View className="p-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
        <Text className="mr-2 text-lg text-muted-foreground">Veciproveedor</Text>
          <Image
            source={typeof providerImage === 'string' ? { uri: providerImage } : providerImage}
            className="w-8 h-8 rounded-full"
          />
          <Text className="ml-2 text-lg font-semibold" numberOfLines={1}>{providerName}</Text>
        </View>
      </View>
      
      <View className="px-4 flex-row items-center">
        <MapPin size={18} color="#ffffff" fill="#666" />
        <Text className="ml-1 text-gray-500">{distance} de distancia</Text>
      </View>

      {/* Items Section */}
      {items?.map((item, index) => (
        <View key={index} className="p-4">
          <View className="flex-row items-center">
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              className="w-20 h-20 rounded-full"
            />
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold" numberOfLines={1}>{item.name}</Text>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center rounded-full border border-gray-200 p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={() => {
                      if (item.quantity <= 1) {
                        onDelete?.(index);
                      } else {
                        onQuantityChange?.(index, item.quantity - 1);
                      }
                    }}
                    className="h-8 w-8"
                  >
                    {item.quantity <= 1 ? (
                      <Trash2 size={18} color="#666666" />
                    ) : (
                      <Minus size={18} color="#666666" />
                    )}
                  </Button>
                  <Text className="mx-4">{item.quantity || 0}</Text>
                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={() => onQuantityChange?.(index, (item.quantity || 0) + 1)}
                    className="h-8 w-8 border border-gray-400 rounded-md"
                  >
                    <Plus size={18} color="#666666" />
                  </Button>
                </View>
                <Text className="text-xl font-bold">${formatPrice(item.price)}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Order Details Section */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="p-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Detalles de la compra</Text>
          {isOpen ? (
            <View className="w-8 h-8 rounded-full border border-gray-400 items-center justify-center">
              <ChevronUp size={20} color="#666666" />
            </View>
          ) : (
            <View className="w-8 h-8 rounded-full border border-gray-400 items-center justify-center">
              <ChevronDown size={20} color="#666666" />
            </View>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Productos</Text>
            <Text className="font-semibold">${formatPrice(subtotal)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Comisión por servicio (10%)</Text>
            <Text className="font-semibold">${formatPrice(serviceCharge)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Domicilio</Text>
            <Text className="font-semibold">${formatPrice(deliveryFee)}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold">${formatPrice(total)}</Text>
          </View>
        </CollapsibleContent>
      </Collapsible>

      {/* Pay Button */}
      <View className="p-4">
        <Button
          className="w-full bg-yellow-400 rounded-full"
          size="lg"
          onPress={() => paymentSheetRef.current?.show()}
        >
          <Text className="text-black font-bold text-xl">Pagar ${formatPrice(total)}</Text>
        </Button>
      </View>

      <PaymentMethodSheet
        ref={paymentSheetRef}
        total={total}
        onSelectMethod={handlePaymentMethodSelect}
      />
    </Card>
  );
}