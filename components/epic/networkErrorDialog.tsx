import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { CircleX } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";

const DELAY_TIME_TO_CLOSE_MODAL = 15000;
const CIRCLE_SIZE = 48;
const STROKE_WIDTH = 4;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let showDialog: ((message?: string) => void) | null = null;

export function NetworkErrorDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [progress, setProgress] = useState(1);

  showDialog = (msg?: string) => {
    setMessage(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), DELAY_TIME_TO_CLOSE_MODAL);
  };
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
        setOpen(false);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                stroke="pink"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="red"
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
              <CircleX size={32} color="red" />
            </View>
          </View>
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            ¡Ups! Hubo un error
          </DialogTitle>
        </DialogHeader>
        <View className="items-center">
          <Text className="text-center text-gray-600 text-base">
            Por favor intenta de nuevo
          </Text>
          <Text className="text-center text-gray-600 text-base">{message}</Text>
        </View>
      </DialogContent>
    </Dialog>
  );
}

export function showNetworkErrorDialog(message?: string) {
  if (showDialog) showDialog(message);
}
