import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image, Platform, SafeAreaView, Animated } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';

export default function ChatsScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '¡Hola! ¿Estás interesado en nuestros productos?',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T09:41:00')
    },
    {
      id: '2',
      text: '¡Hola! Tu pedido de Hamburguesa de carne y queso está listo.',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T09:45:00')
    },
    {
      id: '3',
      text: '¡Genial! ¿Cuándo me lo pueden entregar?',
      sender: 'customer',
      timestamp: new Date('2023-11-30T09:47:00')
    },
    {
      id: '4',
      text: 'Claro que sí el domicilio es extra te cuesta $5.000',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T09:49:00')
    },
    {
      id: '5',
      text: 'Ah bueno esta bien, ¡Mándalo!',
      sender: 'customer',
      timestamp: new Date('2023-11-30T09:51:00')
    },
    {
      id: '6',
      text: 'Sí, perfecto, ya lo envío a tu dirección. Cr123 # 45-67',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T09:55:00')
    },
    {
      id: '7',
      text: 'Listo, muchas gracias.',
      sender: 'customer',
      timestamp: new Date('2023-11-30T09:57:00')
    },
    // Añadir más mensajes simulados para probar el scroll
    {
      id: '8',
      text: '¿Necesitas algo más?',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T10:00:00')
    },
    {
      id: '9',
      text: 'No, eso es todo por ahora. ¡Gracias!',
      sender: 'customer',
      timestamp: new Date('2023-11-30T10:01:00')
    },
    {
      id: '10',
      text: 'Perfecto, no dudes en contactarnos si necesitas cualquier cosa.',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T10:02:00')
    },
    {
      id: '11',
      text: 'Por cierto, ¿tienen disponibles las Arepas de Queso?',
      sender: 'customer',
      timestamp: new Date('2023-11-30T10:05:00')
    },
    {
      id: '12',
      text: 'Sí, claro que tenemos Arepas de Queso disponibles. ¿Te gustaría ordenar algunas?',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T10:07:00')
    },
    {
      id: '13',
      text: 'Excelente, voy a ordenar para mañana.',
      sender: 'customer',
      timestamp: new Date('2023-11-30T10:09:00')
    },
    {
      id: '14',
      text: 'Perfecto, estaremos esperando tu orden.',
      sender: 'vendor',
      timestamp: new Date('2023-11-30T10:11:00')
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Order details (dummy data)
  const order = {
    id: 'ORD-2023-001',
    product: 'Arepas Rellenas de Carne y Queso',
    price: '$20.000',
    customer: {
      name: 'JuanchoSM',
      address: 'Calle 123 St 45 # 65 Sta Marta',
      avatar: 'https://picsum.photos/id/1/200'
    }
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: message,
      sender: 'customer',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Hacemos un scroll al fondo cuando el componente se monta
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 300);
    }
  }, []);

  // Keyboard listeners for iOS
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View className="flex-1 bg-background">
      
      
      {/* Order Info Card */}
      <Card className="mx-4 mt-4 mb-2 bg-card shadow">
        <View className="p-4 flex-row">
          <Image 
            source={{ uri: 'https://picsum.photos/id/292/200' }} 
            className="w-16 h-16 rounded-full mr-4"
            style={{ borderRadius: 8 }}
          />
          <View className="flex-1">
            <Text className="text-lg font-bold">{order.product}</Text>
            <Text className="text-base font-semibold">{order.price}</Text>
            <View className="flex-row mt-2 items-center">
              <Avatar alt={order.customer.name} className="h-6 w-6 mr-2">
                <AvatarImage source={{ uri: order.customer.avatar }} />
                <AvatarFallback>
                  <Text>{order.customer.name.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
              <Text className="text-sm text-muted-foreground">{order.customer.name}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            className={`my-1 max-w-[80%] ${msg.sender === 'customer' ? 'self-end ml-auto' : 'self-start mr-auto'}`}
          >
            <View 
              className={`p-3 rounded-2xl ${
                msg.sender === 'customer' 
                  ? 'bg-[#00563B] rounded-tr-none' 
                  : 'bg-[#FFD100] rounded-tl-none'
              }`}
            >
              <Text 
                className={`${msg.sender === 'customer' ? 'text-primary-foreground' : 'text-foreground'}`}
              >
                {msg.text}
              </Text>
            </View>
            <Text className={`text-xs text-muted-foreground mt-1 ${
              msg.sender === 'customer' ? 'text-right' : 'text-left'
            }`}>
              {formatTime(msg.timestamp)}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input - Fixed positioning */}
      <View 
        className="border-t border-border bg-white"
        style={{
          minHeight: 80,
          paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
        }}
      >
        <View className="p-4 flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 p-3 rounded-full mr-2 text-black"
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#666"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            style={{ maxHeight: 100 }}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            className={`w-12 h-12 rounded-full items-center justify-center ${message.trim() === '' ? 'bg-green-300' : 'bg-green-600'}`}
            disabled={message.trim() === ''}
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 