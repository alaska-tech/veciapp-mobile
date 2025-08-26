import React from 'react';
import { View, Alert } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import {
  registerForPushNotifications,
  sendImmediateNotification,
  scheduleLocalNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  setBadgeCount,
  clearBadge,
} from './notifications';

export default function NotificationsExample() {
  // Función para registrar el dispositivo
  const handleRegisterDevice = async () => {
    try {
      const token = await registerForPushNotifications();
      if (token) {
        Alert.alert(
          'Éxito',
          'Dispositivo registrado para notificaciones push',
          [{ text: 'OK' }]
        );
        console.log('Token:', token.data);
      } else {
        Alert.alert('Error', 'No se pudo registrar el dispositivo');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al registrar el dispositivo');
    }
  };

  // Función para enviar notificación inmediata
  const handleSendImmediateNotification = async () => {
    try {
      await sendImmediateNotification(
        '¡Hola! 👋',
        'Esta es una notificación de prueba enviada inmediatamente.',
        { screen: '/home', type: 'test' }
      );
      Alert.alert('Éxito', 'Notificación enviada');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al enviar notificación');
    }
  };

  // Función para programar notificación para 5 segundos
  const handleScheduleNotification = async () => {
    try {
      const notificationId = await scheduleLocalNotification(
        'Notificación Programada ⏰',
        'Esta notificación se programó para aparecer en 5 segundos.',
        { screen: '/profile', type: 'scheduled' },
        { 
          type: 'timeInterval' as any,
          seconds: 5 
        }
      );
      
      if (notificationId) {
        Alert.alert('Éxito', 'Notificación programada para 5 segundos');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al programar notificación');
    }
  };

  // Función para programar notificación diaria
  const handleScheduleDailyNotification = async () => {
    try {
      const notificationId = await scheduleLocalNotification(
        'Recordatorio Diario 📅',
        '¡No olvides revisar tus pedidos hoy!',
        { screen: '/orders', type: 'daily' },
        {
          type: 'calendar' as any,
          hour: 9,
          minute: 0,
          repeats: true,
        }
      );
      
      if (notificationId) {
        Alert.alert('Éxito', 'Notificación diaria programada para las 9:00 AM');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al programar notificación diaria');
    }
  };

  // Función para cancelar todas las notificaciones
  const handleCancelAllNotifications = async () => {
    try {
      const success = await cancelAllNotifications();
      if (success) {
        Alert.alert('Éxito', 'Todas las notificaciones fueron canceladas');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al cancelar notificaciones');
    }
  };

  // Función para ver notificaciones programadas
  const handleGetScheduledNotifications = async () => {
    try {
      const notifications = await getScheduledNotifications();
      Alert.alert(
        'Notificaciones Programadas',
        `Tienes ${notifications.length} notificación(es) programada(s)`
      );
      console.log('Notificaciones:', notifications);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al obtener notificaciones');
    }
  };

  // Función para configurar badge
  const handleSetBadge = async () => {
    try {
      const success = await setBadgeCount(5);
      if (success) {
        Alert.alert('Éxito', 'Badge configurado a 5');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al configurar badge');
    }
  };

  // Función para limpiar badge
  const handleClearBadge = async () => {
    try {
      const success = await clearBadge();
      if (success) {
        Alert.alert('Éxito', 'Badge limpiado');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al limpiar badge');
    }
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-2xl font-bold text-center mb-6">
        🔔 Pruebas de Notificaciones
      </Text>

      <View className="space-y-3">
        <Button
          onPress={handleRegisterDevice}
          className="w-full bg-blue-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            📱 Registrar Dispositivo
          </Text>
        </Button>

        <Button
          onPress={handleSendImmediateNotification}
          className="w-full bg-green-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            ⚡ Notificación Inmediata
          </Text>
        </Button>

        <Button
          onPress={handleScheduleNotification}
          className="w-full bg-yellow-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            ⏰ Programar (5 segundos)
          </Text>
        </Button>

        <Button
          onPress={handleScheduleDailyNotification}
          className="w-full bg-purple-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            📅 Programar Diaria (9:00 AM)
          </Text>
        </Button>

        <Button
          onPress={handleGetScheduledNotifications}
          className="w-full bg-indigo-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            📋 Ver Programadas
          </Text>
        </Button>

        <Button
          onPress={handleSetBadge}
          className="w-full bg-orange-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            🔢 Configurar Badge (5)
          </Text>
        </Button>

        <Button
          onPress={handleClearBadge}
          className="w-full bg-red-600 rounded-lg"
        >
          <Text className="text-white font-semibold">
            🧹 Limpiar Badge
          </Text>
        </Button>

        <Button
          onPress={handleCancelAllNotifications}
          variant="outline"
          className="w-full border-red-500 rounded-lg"
        >
          <Text className="text-red-500 font-semibold">
            ❌ Cancelar Todas
          </Text>
        </Button>
      </View>

      <Text className="text-sm text-muted-foreground text-center mt-6">
        Usa estos botones para probar todas las funcionalidades de notificaciones
      </Text>
    </View>
  );
}
