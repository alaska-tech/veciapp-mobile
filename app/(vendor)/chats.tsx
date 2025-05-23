import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react-native";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useState } from 'react'; 
import { Stack, useRouter } from "expo-router";

export default function ChatsScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');  

  const chats = [
    {
      id: '1',
      name: 'Julian Rivera',
      lastMessage: 'When will my order arrive?',
      time: '12:30 PM',
      unread: true,
      avatar: 'https://picsum.photos/203'
    },
    {
      id: '2',
      name: 'Adriana Angulo',
      lastMessage: 'Thank you for the quick delivery!',
      time: '11:45 AM',
      unread: false,
      avatar: 'https://picsum.photos/201'
    },
    {
      id: '3',
      name: 'Brayan Mercado',
      lastMessage: 'I have a question about my order.',
      time: '10:15 AM',
      unread: true,
      avatar: 'https://picsum.photos/202'
    },
    {
      id: '4',
      name: 'Julian Angulo',
      lastMessage: 'I need help with my order.',
      time: '9:30 AM',
      unread: false,
      avatar: 'https://picsum.photos/203'
    },
    {
      id: '5',
      name: 'Elder Sarmiento',
      lastMessage: 'I need help with my order.',
      time: '9:30 AM',
      unread: false,
      avatar: 'URL_ADDRESSicsum.photos/204'
    },
    
  ];

  // Add filtered chats logic
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const navigateToChat = (chatId: string) => {
    router.push(`/(vendorscreens)/(vendorchat)/internalVendorChat`);
  };

  return (
    <ScrollView className="h-full w-full p-4">
      <Stack.Screen 
        options={{
          title: "Chat",
          headerTitleAlign: "center",
          headerLargeTitle: true,
          headerShown: true,
        }} 
      />

      <View className="mb-5">
        <View className="flex-row items-center rounded-lg relative">
          <Input
            placeholder="Busca por nombre de cliente"
            className="flex-1 py-3 text-base pl-12 rounded-full shadow-sm"
            value={searchText}
            onChangeText={setSearchText}
          />
          {!searchText && (
            <View className="absolute left-3 top-3">
              <Search size={20} color="#666"/>
            </View>
          )}
        </View>
      </View>

      {filteredChats.map((chat) => (
        <TouchableOpacity 
          key={chat.id} 
          activeOpacity={0.7} 
          onPress={() => navigateToChat(chat.id)}
        >
          <Card className={`mb-4 ${chat.unread ? 'bg-gray-50' : ''}`}>
            <View className="p-4 flex-row items-center">
              <View className="relative">
                <Avatar alt={chat.name} className="h-12 w-12 mr-4">
                  <AvatarImage source={{ uri: chat.avatar }} />
                  <AvatarFallback>
                    <Text>{chat.name.charAt(0)}</Text>
                  </AvatarFallback>
                </Avatar>
                {chat.unread && (
                  <View className="absolute top-0 right-3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className={`${chat.unread ? 'font-bold' : 'font-semibold'}`}>{chat.name}</Text>
                  <Text className={`text-sm ${chat.unread ? 'text-blue-600 font-semibold' : 'text-muted-foreground'}`}>{chat.time}</Text>
                </View>
                <Text 
                  className={`text-sm ${chat.unread ? 'font-semibold text-gray-800' : 'text-muted-foreground'}`}
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