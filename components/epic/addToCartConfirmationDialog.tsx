import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Heart, ShoppingCartIcon } from "lucide-react-native";
import { Button } from "../ui/button";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";

interface FavoriteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}
const DELAY_TIME_TO_CLOSE_MODAL = 7000;
const CIRCLE_SIZE = 48;
const STROKE_WIDTH = 4;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const AddToCartConfirmationDialog: React.FC<
  FavoriteConfirmationDialogProps
> = ({ open, onOpenChange, productName = "Producto" }) => {
  const router = useRouter();
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!open) return;
    setProgress(1);
    const start = Date.now();
    let frame: number;

    const animate = () => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 1 - elapsed / DELAY_TIME_TO_CLOSE_MODAL);
      setProgress(pct);
      if (pct > 0) {
        frame = requestAnimationFrame(animate);
      } else {
        onOpenChange(false);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-2xl p-6 max-w-sm mx-4">
        <DialogHeader className="items-center">
          <View
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              marginBottom: 16,
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#bbf7d0"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#16a34a"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                strokeLinecap="round"
                rotation="-90"
                origin={`${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2}`}
              />
            </Svg>
            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCartIcon size={32} color="#16a34a"  />
            </View>
          </View>
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            {`¡Tu "${productName}" ya esta en el carrito!`}
          </DialogTitle>
        </DialogHeader>
        <View className="flex flex-row justify-between space-x-4">
          <Button
            className="rounded-full py-4 flex-1"
            onPress={() => {
              onOpenChange(false);
            }}
          >
            <Text className="text-black">Seguir viendo</Text>
          </Button>
          <Button
            className="bg-yellow-400 rounded-full py-4 flex-1"
            onPress={() => {
              router.push("/(client)/(tabs)/cart");
              onOpenChange(false);
            }}
          >
            <Text className="text-black">Ir al carrito</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
};
