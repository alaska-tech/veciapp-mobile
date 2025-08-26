import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const useNotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia de notificaciones
  useEffect(() => {
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      setIsLoading(true);
      const preference = await AsyncStorage.getItem('pushNotificationsEnabled');
      
      if (preference !== null) {
        setNotificationsEnabled(JSON.parse(preference));
      } else {
        // Si no hay preferencia guardada, verificar permisos actuales
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationsEnabled(status === 'granted');
      }
    } catch (error) {
      console.error('Error al cargar preferencia de notificaciones:', error);
      // Por defecto, habilitar notificaciones si hay error
      setNotificationsEnabled(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para verificar si se pueden enviar notificaciones
  const canSendNotifications = () => {
    return notificationsEnabled;
  };

  // Función para actualizar el estado (usado por el switch)
  const updateNotificationPreference = async (enabled: boolean) => {
    try {
      setNotificationsEnabled(enabled);
      await AsyncStorage.setItem('pushNotificationsEnabled', JSON.stringify(enabled));
    } catch (error) {
      console.error('Error al actualizar preferencia de notificaciones:', error);
    }
  };

  return {
    notificationsEnabled,
    isLoading,
    canSendNotifications,
    updateNotificationPreference,
    loadNotificationPreference
  };
};
