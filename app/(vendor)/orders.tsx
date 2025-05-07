import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Clock, CheckCircle2, XCircle } from "lucide-react-native";



export default function OrdersScreen() {
  const orders = [
    {
      id: '1',
      customer: 'John Doe',
      items: ['Arepas con queso x2'],
      total: 40000,
      status: 'pending'
    },
    {
      id: '2',
      customer: 'Jane Smith',
      items: ['Picada Samaria x1'],
      total: 35000,
      status: 'completed'
    }
  ];

  return (
    <ScrollView className="h-full w-full p-4 mt-12">
      <Text className="text-3xl font-bold mb-6">Orders</Text>

      {orders.map((order) => (
        <Card key={order.id} className="mb-4">
          <CardContent className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-semibold">{order.customer}</Text>
              <View className="flex-row items-center">
                {order.status === 'pending' ? (
                  <Clock size={20} color="#f59e0b" />
                ) : order.status === 'completed' ? (
                  <CheckCircle2 size={20} color="#16a34a" />
                ) : (
                  <XCircle size={20} color="#dc2626" />
                )}
                <Text className="ml-2 capitalize">{order.status}</Text>
              </View>
            </View>

            {order.items.map((item, index) => (
              <Text key={index} className="text-muted-foreground">{item}</Text>
            ))}

            <View className="flex-row justify-between items-center mt-4">
              <Text className="text-lg font-bold">${order.total.toLocaleString()}</Text>
              <Button size="sm">View Details</Button>
            </View>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
  );
}