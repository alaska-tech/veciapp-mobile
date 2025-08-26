import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configura el manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Función para registrar el dispositivo para notificaciones push
export async function registerForPushNotifications() {
  let token;

  if (Platform.OS === 'android') {
    // Configura el canal de notificaciones para Android
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    // Solicita permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permisos de notificación no concedidos');
      return null;
    }

    // Obtiene el token de notificación
    try {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || 
                   (Constants.expoConfig as any)?.projectId ||
                   Constants.expoConfig?.owner || 'default',
      });
      console.log('Token de notificación:', token.data);
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  } else {
    console.log('Debe usar un dispositivo físico para notificaciones push');
  }

  return token;
}

// Función para enviar notificación local
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
  trigger?: Notifications.NotificationTriggerInput
) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null, // null = enviar inmediatamente
    });
    
    console.log('Notificación local programada:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error al programar notificación local:', error);
    return null;
  }
}

// Función para enviar notificación inmediata
export async function sendImmediateNotification(
  title: string,
  body: string,
  data?: any
) {
  return await scheduleLocalNotification(title, body, data);
}

// Función para cancelar notificación específica
export async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notificación cancelada:', notificationId);
    return true;
  } catch (error) {
    console.error('Error al cancelar notificación:', error);
    return false;
  }
}

// Función para cancelar todas las notificaciones
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas las notificaciones fueron canceladas');
    return true;
  } catch (error) {
    console.error('Error al cancelar todas las notificaciones:', error);
    return false;
  }
}

// Función para obtener notificaciones programadas
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notificaciones programadas:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error al obtener notificaciones programadas:', error);
    return [];
  }
}

// Función para configurar el badge (número en el ícono de la app)
export async function setBadgeCount(count: number) {
  try {
    await Notifications.setBadgeCountAsync(count);
    console.log('Badge configurado a:', count);
    return true;
  } catch (error) {
    console.error('Error al configurar badge:', error);
    return false;
  }
}

// Función para limpiar el badge
export async function clearBadge() {
  try {
    await Notifications.setBadgeCountAsync(0);
    console.log('Badge limpiado');
    return true;
  } catch (error) {
    console.error('Error al limpiar badge:', error);
    return false;
  }
}

// Función para manejar notificaciones recibidas cuando la app está en primer plano
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Función para manejar notificaciones tocadas/abiertas
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Función para remover listeners
export function removeNotificationSubscription(subscription: Notifications.Subscription) {
  subscription.remove();
}