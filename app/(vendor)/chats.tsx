import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react-native";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

export default function ChatsScreen() {
  const chats = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'When will my order arrive?',
      time: '12:30 PM',
      unread: true,
      avatar: 'https://picsum.photos/200'
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Thank you for the quick delivery!',
      time: '11:45 AM',
      unread: false,
      avatar: 'https://picsum.photos/201'
    }
  ];

  return (
    <ScrollView className="h-full w-full p-4 mt-12">
      <Text className="text-3xl font-bold mb-6">Messages</Text>

      <View className="mb-6">
        <View className="relative">
          <Input
            placeholder="Search conversations..."
            className="pl-12 py-3"
          />
          <Search className="absolute left-4 top-3" size={20} color="#666" />
        </View>
      </View>

      {chats.map((chat) => (
        <TouchableOpacity key={chat.id} activeOpacity={0.7}>
          <Card className="mb-4">
            <View className="p-4 flex-row items-center">
              <Avatar alt="avatar" className="h-12 w-12 mr-4">
                <AvatarImage source={{ uri: chat.avatar }} />
                <AvatarFallback>
                  <Text>{chat.name.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>

              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold">{chat.name}</Text>
                  <Text className="text-sm text-muted-foreground">{chat.time}</Text>
                </View>
                <Text 
                  className={`text-sm ${chat.unread ? 'font-semibold' : 'text-muted-foreground'}`}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}