import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

interface TimelineItem {
  status: string;
  time: string;
}

interface VendorHistoryCardProps {
  date: string;
  products: string[];
  price: number;
  clientName: string;
  clientAddress: string;
  clientImage: string;
  status: string;
  timeline: TimelineItem[];
  onChat?: () => void;
}

export default function VendorHistoryCard({
  date,
  products,
  price,
  clientName,
  clientAddress,
  clientImage,
  status,
  timeline,
}: VendorHistoryCardProps) { // removed onChat from props
  const [isExpanded, setIsExpanded] = useState(false);
  
  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  };

  return (
    <Card 
      className="rounded-3xl overflow-hidden mb-4" 
      style={cardShadow}
    >
      <View className="p-6">
        {/* Date and Status Row */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Calendar size={20} color="#666666" />
            <Text className="ml-2 text-base text-muted-foreground">{date}</Text>
          </View>
          <View className="bg-green-100 px-4 py-1.5 rounded-full">
            <Text className="text-green-600 font-medium">{status}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">Productos</Text>
          {products.map((product, index) => (
            <Text key={index} className="text-xl font-semibold mb-1">• {product}</Text>
          ))}
          <Text className="text-2xl font-bold mt-2">
            ${price.toLocaleString()}
          </Text>
        </View>

        {/* Client Info */}
        <View className="mb-6">
          <Text className="text-lg text-muted-foreground mb-2">Cliente</Text>
          <View className="flex-row items-center">
            <Image 
              source={{ uri: clientImage }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-xl font-semibold">{clientName}</Text>
              <Text className="text-base text-muted-foreground">{clientAddress}</Text>
            </View>
          </View>
        </View>

        <Separator className="mb-6" />

        {/* Timeline Dropdown */}
        <TouchableOpacity 
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex-row items-center justify-between"
        >
          <Text className="text-lg font-semibold">Detalles de la compra</Text>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </TouchableOpacity>

        {isExpanded && (
          <View className="ml-4 mt-6">
            {timeline.map((item, index) => (
              <View key={index} className="flex-row items-start">
                <View className="mr-4 items-center">
                  <View className="w-3 h-3 rounded-full bg-[#00563B]" />
                  {index < timeline.length - 1 && (
                    <View className="w-0.5 h-12 bg-[#00563B]" />
                  )}
                </View>
                <View className="flex-1 mb-4">
                  <Text className="text-base font-semibold text-[#00563B]">
                    {item.status}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {item.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}