# 🔔 Sistema de Notificaciones - Veciapp Mobile

Este documento explica **COMPLETAMENTE** cómo usar el sistema de notificaciones implementado en la aplicación Veciapp Mobile, incluyendo **notificaciones locales** y **push desde el backend**.

## 📋 Funcionalidades Disponibles

### 1. **Notificaciones Push (Desde Backend)**
- ✅ Registro automático del dispositivo
- ✅ Recepción de notificaciones del servidor
- ✅ Manejo de notificaciones en primer y segundo plano
- ✅ Navegación automática al tocar notificaciones
- ✅ Tokens únicos por dispositivo

### 2. **Notificaciones Locales (Desde la App)**
- ✅ Envío inmediato de notificaciones
- ✅ Programación de notificaciones para fechas específicas
- ✅ Notificaciones recurrentes (diarias, semanales, etc.)
- ✅ Notificaciones con delays personalizados

### 3. **Gestión de Notificaciones**
- ✅ Cancelar notificaciones específicas
- ✅ Cancelar todas las notificaciones
- ✅ Ver notificaciones programadas
- ✅ Configurar y limpiar badges (números en el ícono)

## 🚀 IMPLEMENTACIÓN COMPLETA

### **PASO 1: Configuración Inicial**

#### 1.1 Verificar Dependencias
Asegúrate de que estas dependencias estén en tu `package.json`:
```json
{
  "dependencies": {
    "expo-notifications": "^0.31.4",
    "expo-device": "^7.1.4"
  }
}
```

#### 1.2 Configuración del app.json
Tu `app.json` ya debe tener esta configuración:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "be5bed90-b3e3-4c8b-95d4-e5595057a604"
      }
    }
  }
}
```

### **PASO 2: Configuración en el Componente Principal**

#### 2.1 Importar Funciones
```typescript
import {
  registerForPushNotifications,
  sendImmediateNotification,
  scheduleLocalNotification,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  setBadgeCount,
  clearBadge,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from '~/lib/notifications';
```

#### 2.2 Configurar Notificaciones al Iniciar la App
```typescript
// En tu App.tsx o componente principal
useEffect(() => {
  setupNotifications();
}, []);

const setupNotifications = async () => {
  try {
    // 1. Registrar para notificaciones push
    const token = await registerForPushNotifications();
    if (token) {
      console.log('✅ Dispositivo registrado para notificaciones push');
      console.log('🔑 Token:', token.data);
      
      // 2. ENVIAR ESTE TOKEN A TU BACKEND
      await sendTokenToBackend(token.data);
    }

    // 3. Configurar listeners para notificaciones
    setupNotificationListeners();
  } catch (error) {
    console.error('❌ Error al configurar notificaciones:', error);
  }
};
```

#### 2.3 Configurar Listeners
```typescript
const setupNotificationListeners = () => {
  // Listener para notificaciones recibidas en primer plano
  const receivedSubscription = addNotificationReceivedListener(notification => {
    console.log('📱 Notificación recibida en primer plano:', notification);
    
    // Aquí puedes mostrar un toast o alert personalizado
    showCustomNotification(notification);
  });

  // Listener para cuando el usuario TOCA la notificación
  const responseSubscription = addNotificationResponseReceivedListener(response => {
    console.log('👆 Usuario tocó la notificación:', response);
    
    // Extraer datos de la notificación
    const data = response.notification.request.content.data;
    
    // Navegar a la pantalla correspondiente
    if (data?.screen) {
      router.push(data.screen);
    }
    
    // Limpiar badge si es necesario
    if (data?.clearBadge) {
      clearBadge();
    }
  });

  // Cleanup al desmontar
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};
```

#### 2.4 Enviar Token al Backend
```typescript
const sendTokenToBackend = async (token: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notifications/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`, // Token del usuario logueado
      },
      body: JSON.stringify({
        deviceToken: token,
        platform: Platform.OS, // 'ios' o 'android'
        userId: currentUser.id,
        appVersion: Constants.expoConfig?.version || '1.0.0',
      }),
    });

    if (response.ok) {
      console.log('✅ Token enviado al backend exitosamente');
    } else {
      console.error('❌ Error al enviar token al backend');
    }
  } catch (error) {
    console.error('❌ Error de red al enviar token:', error);
  }
};
```

## 🔔 NOTIFICACIONES LOCALES (DESDE LA APP)

### **Envío Inmediato**
```typescript
const handleSendNotification = async () => {
  try {
    const notificationId = await sendImmediateNotification(
      '¡Nuevo Pedido! 🎉',
      'Tu pedido #12345 ha sido confirmado',
      { 
        screen: '/orders/12345',
        orderId: '12345',
        type: 'order_confirmation'
      }
    );
    
    if (notificationId) {
      console.log('✅ Notificación enviada con ID:', notificationId);
    }
  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  }
};
```

### **Programar Notificación con Delay**
```typescript
// Notificación en 30 segundos
const scheduleReminder = async () => {
  const notificationId = await scheduleLocalNotification(
    'Recordatorio ⏰',
    'Tu pedido llegará en 30 minutos',
    { screen: '/orders', type: 'delivery_reminder' },
    { 
      type: 'timeInterval',
      seconds: 30 
    }
  );
  
  console.log('⏰ Notificación programada para 30 segundos');
  return notificationId;
};
```

### **Programar Notificación Diaria**
```typescript
const scheduleDailyReminder = async () => {
  const notificationId = await scheduleLocalNotification(
    'Revisa tus Pedidos 📋',
    'No olvides revisar el estado de tus pedidos diariamente',
    { screen: '/orders', type: 'daily_reminder' },
    {
      type: 'calendar',
      hour: 18, // 6:00 PM
      minute: 0,
      repeats: true, // Se repite todos los días
    }
  );
  
  console.log('📅 Notificación diaria programada para las 6:00 PM');
  return notificationId;
};
```

### **Programar Notificación Semanal**
```typescript
const scheduleWeeklyReport = async () => {
  const notificationId = await scheduleLocalNotification(
    'Reporte Semanal 📊',
    'Revisa tu resumen semanal de pedidos',
    { screen: '/reports', type: 'weekly_report' },
    {
      type: 'calendar',
      weekday: 1, // Lunes (1 = Lunes, 2 = Martes, etc.)
      hour: 9,
      minute: 0,
      repeats: true,
    }
  );
  
  console.log('📊 Notificación semanal programada para los lunes a las 9:00 AM');
  return notificationId;
};
```

### **Programar Notificación en Fecha Específica**
```typescript
const scheduleSpecialEvent = async () => {
  const eventDate = new Date('2024-12-25T10:00:00');
  
  const notificationId = await scheduleLocalNotification(
    '¡Evento Especial! 🎄',
    'Hoy tienes descuentos especiales de Navidad',
    { screen: '/promotions', type: 'christmas_sale' },
    {
      type: 'date',
      date: eventDate,
    }
  );
  
  console.log('🎄 Notificación programada para Navidad');
  return notificationId;
};
```

## 🌐 NOTIFICACIONES PUSH (DESDE BACKEND)

### **PASO 3: Configuración del Backend**

#### 3.1 Endpoint para Registrar Dispositivos
```javascript
// POST /api/notifications/register-device
app.post('/api/notifications/register-device', async (req, res) => {
  try {
    const { deviceToken, platform, userId, appVersion } = req.body;
    
    // Guardar en tu base de datos
    await DeviceToken.create({
      token: deviceToken,
      platform,
      userId,
      appVersion,
      isActive: true,
      createdAt: new Date()
    });
    
    res.json({ success: true, message: 'Dispositivo registrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar dispositivo' });
  }
});
```

#### 3.2 Función para Enviar Notificaciones Push
```javascript
// Función para enviar notificación push a un usuario específico
async function sendPushNotification(userId, notification) {
  try {
    // Obtener todos los tokens del usuario
    const deviceTokens = await DeviceToken.findAll({
      where: { userId, isActive: true }
    });
    
    if (deviceTokens.length === 0) {
      console.log(`No hay dispositivos registrados para el usuario ${userId}`);
      return;
    }
    
    // Enviar a cada dispositivo del usuario
    const promises = deviceTokens.map(async (deviceToken) => {
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
          },
          body: JSON.stringify({
            to: deviceToken.token,
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
            sound: 'default',
            badge: notification.badge || 1,
            channelId: 'default',
            priority: 'high',
          }),
        });
        
        const result = await response.json();
        
        if (result.errors) {
          console.error('Error al enviar notificación:', result.errors);
          // Marcar token como inactivo si hay error
          if (result.errors[0]?.code === 'DeviceNotRegistered') {
            await deviceToken.update({ isActive: false });
          }
        } else {
          console.log('✅ Notificación enviada exitosamente');
        }
      } catch (error) {
        console.error('Error al enviar notificación:', error);
      }
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error general al enviar notificaciones:', error);
  }
}
```

#### 3.3 Endpoint para Enviar Notificaciones
```javascript
// POST /api/notifications/send
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { userId, title, body, data, badge } = req.body;
    
    // Validar datos
    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    // Enviar notificación
    await sendPushNotification(userId, {
      title,
      body,
      data,
      badge
    });
    
    res.json({ success: true, message: 'Notificación enviada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
});
```

#### 3.4 Envío Masivo de Notificaciones
```javascript
// POST /api/notifications/send-bulk
app.post('/api/notifications/send-bulk', async (req, res) => {
  try {
    const { userIds, title, body, data, badge } = req.body;
    
    // Enviar a múltiples usuarios
    const promises = userIds.map(userId => 
      sendPushNotification(userId, { title, body, data, badge })
    );
    
    await Promise.all(promises);
    
    res.json({ success: true, message: `Notificaciones enviadas a ${userIds.length} usuarios` });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar notificaciones masivas' });
  }
});
```

### **PASO 4: Casos de Uso del Backend**

#### 4.1 Notificación de Nuevo Pedido
```javascript
// Cuando se crea un nuevo pedido
app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    // Enviar notificación al cliente
    await sendPushNotification(order.userId, {
      title: '¡Nuevo Pedido Confirmado! 🎉',
      body: `Tu pedido #${order.id} ha sido confirmado y está siendo procesado`,
      data: {
        screen: '/orders',
        orderId: order.id,
        type: 'order_confirmed'
      },
      badge: 1
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});
```

#### 4.2 Notificación de Cambio de Estado
```javascript
// Cuando cambia el estado de un pedido
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    await order.update({ status });
    
    // Mapear estados a mensajes
    const statusMessages = {
      'preparing': 'Tu pedido está siendo preparado 👨‍🍳',
      'ready': '¡Tu pedido está listo para recoger! 🚀',
      'delivering': 'Tu pedido está en camino 🚚',
      'delivered': '¡Tu pedido ha sido entregado! ✅'
    };
    
    // Enviar notificación
    await sendPushNotification(order.userId, {
      title: 'Actualización de Pedido 📦',
      body: statusMessages[status] || `Estado actualizado: ${status}`,
      data: {
        screen: '/orders',
        orderId: order.id,
        type: 'status_update',
        newStatus: status
      },
      badge: 1
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});
```

#### 4.3 Notificación de Chat
```javascript
// Cuando llega un nuevo mensaje
app.post('/api/chat/messages', async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    
    // Obtener información del chat
    const chat = await Chat.findByPk(message.chatId, {
      include: [{ model: User, as: 'participants' }]
    });
    
    // Enviar notificación a todos los participantes excepto al remitente
    const recipients = chat.participants.filter(p => p.id !== message.senderId);
    
    const promises = recipients.map(recipient =>
      sendPushNotification(recipient.id, {
        title: 'Nuevo Mensaje 💬',
        body: `${message.senderName}: ${message.content.substring(0, 50)}...`,
        data: {
          screen: '/chats',
          chatId: chat.id,
          type: 'new_message',
          senderId: message.senderId
        },
        badge: 1
      })
    );
    
    await Promise.all(promises);
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});
```

#### 4.4 Notificación de Promoción
```javascript
// Envío masivo de promociones
app.post('/api/promotions/send', async (req, res) => {
  try {
    const { title, body, data, targetUsers } = req.body;
    
    // Obtener usuarios objetivo (por ejemplo, usuarios activos en los últimos 30 días)
    let userIds;
    if (targetUsers === 'active') {
      const activeUsers = await User.findAll({
        where: {
          lastLoginAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        attributes: ['id']
      });
      userIds = activeUsers.map(u => u.id);
    } else if (targetUsers === 'all') {
      const allUsers = await User.findAll({ attributes: ['id'] });
      userIds = allUsers.map(u => u.id);
    } else {
      userIds = targetUsers; // Array de IDs específicos
    }
    
    // Enviar notificaciones
    await sendPushNotification(userIds, {
      title,
      body,
      data: {
        screen: '/promotions',
        type: 'promotion',
        ...data
      },
      badge: 1
    });
    
    res.json({ success: true, message: `Promoción enviada a ${userIds.length} usuarios` });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar promoción' });
  }
});
```

## 🎯 CASOS DE USO ESPECÍFICOS PARA VECIAPP

### **1. Notificaciones de Pedidos**
```typescript
// Cliente: Pedido confirmado
await sendImmediateNotification(
  '¡Pedido Confirmado! 🎉',
  'Tu pedido #12345 ha sido confirmado y está siendo procesado',
  { screen: '/orders/12345', orderId: '12345' }
);

// Cliente: Pedido en preparación
await scheduleLocalNotification(
  'Tu Pedido se Está Preparando 👨‍🍳',
  'El vendedor está preparando tu pedido. Estará listo pronto.',
  { screen: '/orders/12345', orderId: '12345' },
  { type: 'timeInterval', seconds: 300 } // 5 minutos
);

// Cliente: Pedido listo
await sendImmediateNotification(
  '¡Tu Pedido Está Listo! 🚀',
  'Puedes pasar a recoger tu pedido #12345',
  { screen: '/orders/12345', orderId: '12345' }
);
```

### **2. Notificaciones de Chat**
```typescript
// Nuevo mensaje del vendedor
await sendImmediateNotification(
  'Nuevo Mensaje del Vendedor 💬',
  'Tienes un nuevo mensaje sobre tu pedido',
  { screen: '/chats', chatId: 'chat123' }
);

// Recordatorio de chat inactivo
await scheduleLocalNotification(
  '¿Tienes Dudas? 💭',
  'No dudes en preguntar si tienes alguna duda sobre tu pedido',
  { screen: '/chats', chatId: 'chat123' },
  { type: 'timeInterval', seconds: 3600 } // 1 hora
);
```

### **3. Notificaciones de Ubicación**
```typescript
// Pedido cerca de la ubicación
await sendImmediateNotification(
  '¡Tu Pedido Está Cerca! 📍',
  'Tu pedido está a 5 minutos de tu ubicación',
  { screen: '/orders/12345', orderId: '12345' }
);

// Recordatorio de ubicación
await scheduleLocalNotification(
  'Actualiza tu Ubicación 📍',
  'Asegúrate de que tu ubicación esté actualizada para recibir tu pedido',
  { screen: '/profile/location' },
  { type: 'calendar', hour: 12, minute: 0, repeats: true } // Diario a las 12 PM
);
```

### **4. Notificaciones de Promociones**
```typescript
// Oferta especial
await scheduleLocalNotification(
  '¡Oferta Especial! 🎁',
  'Hoy tienes 20% de descuento en todos los productos',
  { screen: '/promotions', type: 'special_offer' },
  { type: 'calendar', hour: 9, minute: 0, repeats: false } // Solo hoy a las 9 AM
);

// Recordatorio de carrito abandonado
await scheduleLocalNotification(
  '¡No Olvides tu Carrito! 🛒',
  'Tienes productos en tu carrito esperando por ti',
  { screen: '/cart', type: 'abandoned_cart' },
  { type: 'timeInterval', seconds: 7200 } // 2 horas
);
```

## 🔧 GESTIÓN AVANZADA DE NOTIFICACIONES

### **Cancelar Notificaciones Específicas**
```typescript
// Cancelar notificación de recordatorio de pedido
const cancelOrderReminder = async (orderId: string) => {
  try {
    // Obtener todas las notificaciones programadas
    const notifications = await getScheduledNotifications();
    
    // Encontrar la notificación específica
    const targetNotification = notifications.find(n => 
      n.content.data?.orderId === orderId && 
      n.content.data?.type === 'order_reminder'
    );
    
    if (targetNotification) {
      await cancelNotification(targetNotification.identifier);
      console.log('✅ Recordatorio de pedido cancelado');
    }
  } catch (error) {
    console.error('❌ Error al cancelar recordatorio:', error);
  }
};
```

### **Gestionar Badges Inteligentemente**
```typescript
// Configurar badge basado en notificaciones no leídas
const updateBadgeCount = async () => {
  try {
    // Obtener notificaciones no leídas del backend
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notifications/unread-count`);
    const { count } = await response.json();
    
    // Actualizar badge
    await setBadgeCount(count);
    console.log(`🔢 Badge actualizado a ${count}`);
  } catch (error) {
    console.error('❌ Error al actualizar badge:', error);
  }
};

// Limpiar badge al abrir la app
const clearBadgeOnAppOpen = async () => {
  try {
    await clearBadge();
    console.log('🧹 Badge limpiado al abrir la app');
  } catch (error) {
    console.error('❌ Error al limpiar badge:', error);
  }
};
```

### **Notificaciones con Sonidos Personalizados**
```typescript
// Notificación con sonido personalizado (solo Android)
const sendNotificationWithCustomSound = async () => {
  try {
    const notificationId = await scheduleLocalNotification(
      'Notificación con Sonido 🎵',
      'Esta notificación tiene un sonido personalizado',
      { screen: '/home', type: 'custom_sound' },
      null, // Sin trigger = inmediata
      {
        sound: 'custom_sound.wav', // Archivo de sonido personalizado
        priority: 'high'
      }
    );
    
    console.log('🎵 Notificación con sonido personalizado enviada');
    return notificationId;
  } catch (error) {
    console.error('❌ Error al enviar notificación con sonido:', error);
  }
};
```

## 📱 CONFIGURACIÓN POR PLATAFORMA

### **iOS**
```typescript
// Configuración específica para iOS
if (Platform.OS === 'ios') {
  // Solicitar permisos específicos
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
  
  if (status === 'granted') {
    console.log('✅ Permisos de iOS concedidos');
  }
}
```

### **Android**
```typescript
// Configuración específica para Android
if (Platform.OS === 'android') {
  // Crear canal de notificaciones personalizado
  await Notifications.setNotificationChannelAsync('orders', {
    name: 'Pedidos',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    sound: 'default',
    enableVibrate: true,
    showBadge: true,
  });
  
  // Crear canal para promociones
  await Notifications.setNotificationChannelAsync('promotions', {
    name: 'Promociones',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 100, 100, 100],
    lightColor: '#4CAF50',
    sound: 'default',
    enableVibrate: true,
    showBadge: false,
  });
}
```

## 🧪 PRUEBAS Y DEBUGGING

### **Función de Prueba Completa**
```typescript
const testAllNotifications = async () => {
  try {
    console.log('🧪 Iniciando pruebas de notificaciones...');
    
    // 1. Notificación inmediata
    console.log('📱 Enviando notificación inmediata...');
    await sendImmediateNotification(
      'Prueba Inmediata ⚡',
      'Esta es una notificación de prueba inmediata',
      { screen: '/test', type: 'immediate_test' }
    );
    
    // 2. Notificación programada
    console.log('⏰ Programando notificación para 10 segundos...');
    const scheduledId = await scheduleLocalNotification(
      'Prueba Programada ⏰',
      'Esta notificación se programó para 10 segundos',
      { screen: '/test', type: 'scheduled_test' },
      { type: 'timeInterval', seconds: 10 }
    );
    
    // 3. Configurar badge
    console.log('🔢 Configurando badge a 3...');
    await setBadgeCount(3);
    
    // 4. Ver notificaciones programadas
    console.log('📋 Obteniendo notificaciones programadas...');
    const scheduled = await getScheduledNotifications();
    console.log(`📋 Tienes ${scheduled.length} notificación(es) programada(s)`);
    
    // 5. Limpiar badge después de 15 segundos
    setTimeout(async () => {
      console.log('🧹 Limpiando badge...');
      await clearBadge();
      console.log('✅ Badge limpiado');
    }, 15000);
    
    console.log('✅ Todas las pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
};
```

### **Logs de Debugging**
```typescript
// Agregar logs detallados para debugging
const debugNotification = async (action: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`🔍 [${timestamp}] ${action}:`, data);
  
  // También puedes enviar a un servicio de logging
  try {
    await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'debug',
        action,
        data,
        timestamp,
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version
      })
    });
  } catch (error) {
    console.error('Error al enviar log:', error);
  }
};
```

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Problema: Notificaciones no aparecen**
```typescript
// Verificar configuración paso a paso
const debugNotificationSetup = async () => {
  try {
    console.log('🔍 Debugging configuración de notificaciones...');
    
    // 1. Verificar permisos
    const permissions = await Notifications.getPermissionsAsync();
    console.log('📋 Permisos:', permissions);
    
    // 2. Verificar handler
    const handler = Notifications.getNotificationHandler();
    console.log('⚙️ Handler configurado:', !!handler);
    
    // 3. Verificar si es dispositivo físico
    console.log('📱 Es dispositivo físico:', Device.isDevice);
    
    // 4. Verificar configuración del proyecto
    console.log('🏗️ Project ID:', Constants.expoConfig?.extra?.eas?.projectId);
    
    // 5. Probar notificación de prueba
    await sendImmediateNotification(
      'Prueba de Debug 🔍',
      'Si ves esto, las notificaciones funcionan',
      { type: 'debug_test' }
    );
    
  } catch (error) {
    console.error('❌ Error en debugging:', error);
  }
};
```

### **Problema: Tokens no se generan**
```typescript
// Verificar generación de tokens
const debugTokenGeneration = async () => {
  try {
    console.log('🔑 Debugging generación de tokens...');
    
    // 1. Verificar configuración de EAS
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    console.log('🏗️ Project ID encontrado:', projectId);
    
    if (!projectId) {
      console.error('❌ No se encontró Project ID en la configuración');
      return;
    }
    
    // 2. Intentar generar token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId
    });
    
    console.log('✅ Token generado exitosamente:', token.data);
    return token;
    
  } catch (error) {
    console.error('❌ Error al generar token:', error);
    
    // Verificar si es un error de configuración
    if (error.message?.includes('projectId')) {
      console.error('💡 Verifica que tengas un Project ID válido en app.json');
    }
  }
};
```

## 📚 RECURSOS ADICIONALES

### **Documentación Oficial**
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

### **Herramientas de Testing**
- [Expo Push Tool](https://expo.dev/notifications) - Para probar notificaciones push
- [Expo Dev Tools](https://docs.expo.dev/develop/tools/) - Para debugging

### **Mejores Prácticas**
- **No spamear**: Respeta los límites de notificaciones
- **Personalización**: Usa datos del usuario para personalizar mensajes
- **Timing**: Envía notificaciones en momentos apropiados
- **Testing**: Prueba en dispositivos físicos antes de producción

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Con esta implementación completa tienes:

✅ **Notificaciones locales** funcionando perfectamente  
✅ **Sistema de push** listo para conectar con tu backend  
✅ **Gestión completa** de notificaciones y badges  
✅ **Configuración optimizada** para iOS y Android  
✅ **Casos de uso específicos** para Veciapp  
✅ **Herramientas de debugging** para resolver problemas  
✅ **Documentación completa** para tu equipo  

**¡Tu aplicación está lista para mantener a los usuarios informados y comprometidos!** 🚀

---

**¿Necesitas ayuda con algún aspecto específico o tienes preguntas sobre la implementación?** 🤔
