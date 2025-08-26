# 🚀 Guía de Implementación: Notificaciones Push desde Backend

## 📋 **Resumen Ejecutivo**

Esta guía explica **paso a paso** cómo implementar notificaciones push desde tu backend para conectar con la app móvil Veciapp (Expo). 

**Casos de uso principales:**
- 🔔 **Estados de pedidos** (pagado → en preparación → en camino → entregado)
- 💳 **Confirmación de pagos** por pasarela
- 📦 **Seguimiento de delivery** en tiempo real
- ❌ **Cancelaciones** y cambios de estado

---

## 🏗️ **Arquitectura del Sistema**

### **Flujo de Notificaciones Push:**
```
Backend → Expo Push Service → Dispositivo Móvil → App Veciapp
```

### **Componentes Clave:**
1. **Tu Backend** - Genera y envía notificaciones
2. **Expo Push Service** - Servicio gratuito de Expo para envío
3. **App Móvil** - Recibe y muestra notificaciones
4. **Base de Datos** - Almacena tokens de dispositivos

---

## 🔧 **PASO 1: Configuración Inicial del Backend**

### **1.1 Instalar Dependencias**

```bash
# Node.js
npm install node-fetch axios

# Python
pip install requests

# PHP
composer require guzzlehttp/guzzle

# Java
# Agregar en pom.xml
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.9.1</version>
</dependency>
```

### **1.2 Variables de Entorno**

```env
# .env
EXPO_PUSH_URL=https://exp.host/--/api/v2/push/send
EXPO_PROJECT_ID=be5bed90-b3e3-4c8b-95d4-e5595057a604
```

---

## 📱 **PASO 2: Estructura de Base de Datos**

### **2.1 Tabla de Tokens de Dispositivos**

```sql
CREATE TABLE device_tokens (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    device_token TEXT NOT NULL,
    platform VARCHAR(10) NOT NULL, -- 'ios' o 'android'
    app_version VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    
    -- Índices para búsquedas rápidas
    INDEX idx_user_id (user_id),
    INDEX idx_device_token (device_token),
    INDEX idx_is_active (is_active)
);
```

### **2.2 Tabla de Historial de Notificaciones (Opcional)**

```sql
CREATE TABLE notification_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed', 'delivered'
    error_message TEXT
);
```

---

## 🔑 **PASO 3: Endpoint para Registrar Dispositivos**

### **3.1 Endpoint de Registro**

```javascript
// POST /api/notifications/register-device
app.post('/api/notifications/register-device', async (req, res) => {
  try {
    const { deviceToken, platform, userId, appVersion } = req.body;
    
    // Validar datos requeridos
    if (!deviceToken || !platform || !userId) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos',
        required: ['deviceToken', 'platform', 'userId']
      });
    }
    
    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Buscar si ya existe un token para este dispositivo/usuario
    let deviceTokenRecord = await DeviceToken.findOne({
      where: { 
        user_id: userId,
        device_token: deviceToken 
      }
    });
    
    if (deviceTokenRecord) {
      // Actualizar token existente
      await deviceTokenRecord.update({
        platform,
        app_version: appVersion,
        is_active: true,
        updated_at: new Date(),
        last_used_at: new Date()
      });
    } else {
      // Crear nuevo registro
      await DeviceToken.create({
        user_id: userId,
        device_token: deviceToken,
        platform,
        app_version: appVersion,
        is_active: true
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Dispositivo registrado exitosamente',
      deviceToken,
      platform,
      userId
    });
    
  } catch (error) {
    console.error('Error al registrar dispositivo:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});
```

### **3.2 Endpoint para Desregistrar Dispositivos**

```javascript
// DELETE /api/notifications/unregister-device
app.delete('/api/notifications/unregister-device', async (req, res) => {
  try {
    const { deviceToken, userId } = req.body;
    
    // Marcar token como inactivo
    await DeviceToken.update(
      { is_active: false, updated_at: new Date() },
      { 
        where: { 
          user_id: userId,
          device_token: deviceToken 
        }
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Dispositivo desregistrado exitosamente' 
    });
    
  } catch (error) {
    console.error('Error al desregistrar dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

---

## 📤 **PASO 4: Función Principal de Envío de Notificaciones**

### **4.1 Función Base para Enviar Notificaciones**

```javascript
// Función para enviar notificación push a un usuario específico
async function sendPushNotification(userId, notification) {
  try {
    console.log(`📱 Enviando notificación a usuario ${userId}:`, notification.title);
    
    // Obtener todos los tokens activos del usuario
    const deviceTokens = await DeviceToken.findAll({
      where: { 
        user_id: userId, 
        is_active: true 
      }
    });
    
    if (deviceTokens.length === 0) {
      console.log(`⚠️ No hay dispositivos registrados para el usuario ${userId}`);
      return { success: false, reason: 'no_devices' };
    }
    
    // Preparar payload de la notificación
    const pushPayload = {
      to: deviceTokens.map(dt => dt.device_token),
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      sound: 'default',
      badge: notification.badge || 1,
      channelId: 'default',
      priority: 'high',
      // Configuraciones específicas por plataforma
      ...(notification.ios && { ios: notification.ios }),
      ...(notification.android && { android: notification.android })
    };
    
    console.log('📤 Payload de notificación:', JSON.stringify(pushPayload, null, 2));
    
    // Enviar a Expo Push Service
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
      },
      body: JSON.stringify(pushPayload)
    });
    
    const result = await response.json();
    
    // Procesar respuesta
    if (result.errors && result.errors.length > 0) {
      console.error('❌ Errores al enviar notificación:', result.errors);
      
      // Manejar tokens inválidos
      for (const error of result.errors) {
        if (error.code === 'DeviceNotRegistered' || error.code === 'InvalidCredentials') {
          // Marcar token como inactivo
          const invalidToken = error.details?.expoPushToken;
          if (invalidToken) {
            await DeviceToken.update(
              { is_active: false, updated_at: new Date() },
              { where: { device_token: invalidToken } }
            );
            console.log(`🔒 Token marcado como inactivo: ${invalidToken}`);
          }
        }
      }
      
      return { success: false, errors: result.errors };
    }
    
    // Registrar en historial (opcional)
    if (notification.saveToHistory !== false) {
      await saveNotificationToHistory(userId, notification);
    }
    
    console.log(`✅ Notificación enviada exitosamente a ${deviceTokens.length} dispositivo(s)`);
    return { 
      success: true, 
      devicesCount: deviceTokens.length,
      messageId: result.data?.id 
    };
    
  } catch (error) {
    console.error('❌ Error al enviar notificación push:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Función para guardar en historial (opcional)
async function saveNotificationToHistory(userId, notification) {
  try {
    await NotificationHistory.create({
      user_id: userId,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      status: 'sent'
    });
  } catch (error) {
    console.error('Error al guardar en historial:', error);
  }
}
```

---

## 🎯 **PASO 5: Implementación de Casos de Uso Específicos**

### **5.1 Notificaciones de Cambio de Estado de Pedidos**

```javascript
// Función para notificar cambio de estado de pedido
async function notifyOrderStatusChange(orderId, newStatus, userId) {
  try {
    // Mapear estados a mensajes amigables
    const statusMessages = {
      'paid': {
        title: '💳 Pago Confirmado',
        body: 'Tu pedido ha sido confirmado y está siendo procesado',
        badge: 1
      },
      'preparing': {
        title: '👨‍🍳 Pedido en Preparación',
        body: 'Tu pedido está siendo preparado. ¡Estará listo pronto!',
        badge: 1
      },
      'ready': {
        title: '🚀 ¡Pedido Listo!',
        body: 'Tu pedido está listo para recoger o ser enviado',
        badge: 1
      },
      'on_way': {
        title: '🚚 Pedido en Camino',
        body: 'Tu pedido está siendo entregado. ¡Llegará pronto!',
        badge: 1
      },
      'delivered': {
        title: '✅ Pedido Entregado',
        body: '¡Tu pedido ha sido entregado exitosamente!',
        badge: 1
      },
      'cancelled': {
        title: '❌ Pedido Cancelado',
        body: 'Tu pedido ha sido cancelado. Contacta soporte si tienes dudas.',
        badge: 1
      }
    };
    
    const messageConfig = statusMessages[newStatus];
    if (!messageConfig) {
      console.warn(`⚠️ Estado de pedido no reconocido: ${newStatus}`);
      return;
    }
    
    // Enviar notificación
    const result = await sendPushNotification(userId, {
      title: messageConfig.title,
      body: messageConfig.body,
      badge: messageConfig.badge,
      data: {
        screen: '/orders',
        orderId: orderId,
        type: 'order_status_change',
        newStatus: newStatus,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`📱 Notificación de cambio de estado enviada:`, {
      orderId,
      newStatus,
      result
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Error al notificar cambio de estado:', error);
    throw error;
  }
}

// Uso en tu lógica de negocio
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    
    // Actualizar estado del pedido en tu base de datos
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    await order.update({ status: newStatus });
    
    // Enviar notificación push
    await notifyOrderStatusChange(id, newStatus, order.user_id);
    
    res.json({ 
      success: true, 
      order,
      notification: 'Notificación enviada'
    });
    
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

### **5.2 Notificaciones de Confirmación de Pago**

```javascript
// Función para notificar confirmación de pago
async function notifyPaymentConfirmation(orderId, userId, paymentDetails) {
  try {
    const notification = {
      title: '💳 ¡Pago Confirmado!',
      body: `Tu pago de $${paymentDetails.amount} ha sido confirmado exitosamente`,
      badge: 1,
      data: {
        screen: '/orders',
        orderId: orderId,
        type: 'payment_confirmation',
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.method,
        timestamp: new Date().toISOString()
      }
    };
    
    const result = await sendPushNotification(userId, notification);
    
    console.log(`💰 Notificación de confirmación de pago enviada:`, {
      orderId,
      userId,
      result
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Error al notificar confirmación de pago:', error);
    throw error;
  }
}

// Uso en tu webhook de pasarela de pago
app.post('/api/webhooks/payment-confirmation', async (req, res) => {
  try {
    const { orderId, userId, amount, paymentMethod, status } = req.body;
    
    if (status === 'confirmed' || status === 'success') {
      // Confirmar pago en tu base de datos
      await Order.update(
        { 
          payment_status: 'paid',
          paid_at: new Date()
        },
        { where: { id: orderId } }
      );
      
      // Enviar notificación push
      await notifyPaymentConfirmation(orderId, userId, {
        amount,
        method: paymentMethod
      });
      
      // También notificar cambio de estado
      await notifyOrderStatusChange(orderId, 'paid', userId);
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error en webhook de pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

### **5.3 Notificaciones de Seguimiento de Delivery**

```javascript
// Función para notificar actualizaciones de delivery
async function notifyDeliveryUpdate(orderId, userId, deliveryInfo) {
  try {
    const notification = {
      title: '🚚 Actualización de Delivery',
      body: deliveryInfo.message,
      badge: 1,
      data: {
        screen: '/orders',
        orderId: orderId,
        type: 'delivery_update',
        deliveryStatus: deliveryInfo.status,
        estimatedTime: deliveryInfo.estimatedTime,
        location: deliveryInfo.location,
        timestamp: new Date().toISOString()
      }
    };
    
    const result = await sendPushNotification(userId, notification);
    
    console.log(`📦 Notificación de delivery enviada:`, {
      orderId,
      deliveryInfo,
      result
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Error al notificar actualización de delivery:', error);
    throw error;
  }
}

// Uso en tu sistema de tracking
app.post('/api/delivery/update', async (req, res) => {
  try {
    const { orderId, status, message, estimatedTime, location } = req.body;
    
    // Obtener información del pedido
    const order = await Order.findByPk(orderId, {
      include: [{ model: User, attributes: ['id'] }]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    // Actualizar estado de delivery
    await Delivery.update(
      { 
        status,
        last_update: new Date(),
        estimated_time: estimatedTime,
        current_location: location
      },
      { where: { order_id: orderId } }
    );
    
    // Enviar notificación push
    await notifyDeliveryUpdate(orderId, order.User.id, {
      status,
      message,
      estimatedTime,
      location
    });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error al actualizar delivery:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

---

## 🔄 **PASO 6: Envío Masivo y Programado**

### **6.1 Envío Masivo de Notificaciones**

```javascript
// Función para enviar notificaciones a múltiples usuarios
async function sendBulkNotifications(userIds, notification) {
  try {
    console.log(`📤 Enviando notificación masiva a ${userIds.length} usuarios`);
    
    const results = [];
    const batchSize = 100; // Procesar en lotes para evitar sobrecarga
    
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (userId) => {
        try {
          const result = await sendPushNotification(userId, notification);
          return { userId, success: true, result };
        } catch (error) {
          console.error(`❌ Error al enviar a usuario ${userId}:`, error);
          return { userId, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Pausa entre lotes para no sobrecargar Expo
      if (i + batchSize < userIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    console.log(`📊 Resultado del envío masivo:`, {
      total: userIds.length,
      success: successCount,
      failed: failureCount
    });
    
    return {
      success: true,
      total: userIds.length,
      successCount,
      failureCount,
      results
    };
    
  } catch (error) {
    console.error('❌ Error en envío masivo:', error);
    throw error;
  }
}

// Uso para promociones o anuncios
app.post('/api/notifications/send-promotion', async (req, res) => {
  try {
    const { title, body, targetUsers, data } = req.body;
    
    let userIds;
    
    if (targetUsers === 'all') {
      // Todos los usuarios activos
      const users = await User.findAll({
        where: { is_active: true },
        attributes: ['id']
      });
      userIds = users.map(u => u.id);
    } else if (targetUsers === 'active') {
      // Usuarios activos en los últimos 30 días
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const users = await User.findAll({
        where: {
          is_active: true,
          last_login_at: { [Op.gte]: thirtyDaysAgo }
        },
        attributes: ['id']
      });
      userIds = users.map(u => u.id);
    } else {
      // Array específico de IDs
      userIds = targetUsers;
    }
    
    const result = await sendBulkNotifications(userIds, {
      title,
      body,
      data: {
        screen: '/promotions',
        type: 'promotion',
        ...data
      },
      badge: 1
    });
    
    res.json(result);
    
  } catch (error) {
    console.error('Error al enviar promoción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

### **6.2 Notificaciones Programadas**

```javascript
// Función para programar notificaciones
async function scheduleNotification(userId, notification, scheduledTime) {
  try {
    // Guardar notificación programada en base de datos
    const scheduledNotification = await ScheduledNotification.create({
      user_id: userId,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      scheduled_time: scheduledTime,
      status: 'pending'
    });
    
    console.log(`⏰ Notificación programada para usuario ${userId} en ${scheduledTime}`);
    
    return scheduledNotification;
    
  } catch (error) {
    console.error('❌ Error al programar notificación:', error);
    throw error;
  }
}

// Job programado para enviar notificaciones (usando cron o similar)
// Ejecutar cada minuto
async function processScheduledNotifications() {
  try {
    const now = new Date();
    
    // Obtener notificaciones programadas para este momento
    const scheduledNotifications = await ScheduledNotification.findAll({
      where: {
        status: 'pending',
        scheduled_time: { [Op.lte]: now }
      }
    });
    
    console.log(`⏰ Procesando ${scheduledNotifications.length} notificaciones programadas`);
    
    for (const scheduled of scheduledNotifications) {
      try {
        // Marcar como procesando
        await scheduled.update({ status: 'processing' });
        
        // Enviar notificación
        const result = await sendPushNotification(scheduled.user_id, {
          title: scheduled.title,
          body: scheduled.body,
          data: scheduled.data
        });
        
        // Marcar como completada
        await scheduled.update({ 
          status: 'completed',
          sent_at: new Date(),
          result: JSON.stringify(result)
        });
        
        console.log(`✅ Notificación programada enviada: ${scheduled.id}`);
        
      } catch (error) {
        console.error(`❌ Error al procesar notificación programada ${scheduled.id}:`, error);
        
        // Marcar como fallida
        await scheduled.update({ 
          status: 'failed',
          error_message: error.message
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error al procesar notificaciones programadas:', error);
  }
}

// Configurar cron job (ejemplo con node-cron)
import cron from 'node-cron';

// Ejecutar cada minuto
cron.schedule('* * * * *', processScheduledNotifications);
```

---

## 🧪 **PASO 7: Testing y Debugging**

### **7.1 Endpoint de Prueba**

```javascript
// POST /api/notifications/test
app.post('/api/notifications/test', async (req, res) => {
  try {
    const { userId, type = 'test' } = req.body;
    
    let notification;
    
    switch (type) {
      case 'order_status':
        notification = {
          title: '📦 Prueba: Cambio de Estado',
          body: 'Esta es una notificación de prueba para cambio de estado de pedido',
          data: {
            screen: '/orders',
            type: 'test_order_status',
            orderId: 'test-123'
          }
        };
        break;
        
      case 'payment':
        notification = {
          title: '💳 Prueba: Confirmación de Pago',
          body: 'Esta es una notificación de prueba para confirmación de pago',
          data: {
            screen: '/orders',
            type: 'test_payment',
            orderId: 'test-123'
          }
        };
        break;
        
      default:
        notification = {
          title: '🧪 Notificación de Prueba',
          body: 'Esta es una notificación de prueba desde el backend',
          data: {
            screen: '/',
            type: 'test'
          }
        };
    }
    
    const result = await sendPushNotification(userId, notification);
    
    res.json({
      success: true,
      message: 'Notificación de prueba enviada',
      notification,
      result
    });
    
  } catch (error) {
    console.error('Error en notificación de prueba:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

### **7.2 Logs y Monitoreo**

```javascript
// Middleware para logging de notificaciones
app.use('/api/notifications/*', (req, res, next) => {
  console.log(`📱 [${new Date().toISOString()}] ${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers
  });
  next();
});

// Función para obtener estadísticas
app.get('/api/notifications/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      DeviceToken.count({ where: { is_active: true } }),
      DeviceToken.count({ where: { platform: 'ios' } }),
      DeviceToken.count({ where: { platform: 'android' } }),
      NotificationHistory.count({ where: { status: 'sent' } }),
      NotificationHistory.count({ where: { status: 'failed' } })
    ]);
    
    res.json({
      totalActiveDevices: stats[0],
      iosDevices: stats[1],
      androidDevices: stats[2],
      notificationsSent: stats[3],
      notificationsFailed: stats[4],
      successRate: stats[3] / (stats[3] + stats[4]) * 100
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

---

## 🚨 **PASO 8: Manejo de Errores y Fallbacks**

### **8.1 Manejo de Tokens Inválidos**

```javascript
// Función para limpiar tokens inválidos
async function cleanupInvalidTokens() {
  try {
    console.log('🧹 Iniciando limpieza de tokens inválidos...');
    
    // Obtener tokens que no han sido usados en los últimos 30 días
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const inactiveTokens = await DeviceToken.findAll({
      where: {
        last_used_at: { [Op.lt]: thirtyDaysAgo },
        is_active: true
      }
    });
    
    console.log(`📱 Encontrados ${inactiveTokens.length} tokens inactivos`);
    
    // Marcar como inactivos
    for (const token of inactiveTokens) {
      await token.update({ 
        is_active: false,
        updated_at: new Date()
      });
    }
    
    console.log('✅ Limpieza de tokens completada');
    
  } catch (error) {
    console.error('❌ Error en limpieza de tokens:', error);
  }
}

// Ejecutar limpieza diaria
cron.schedule('0 2 * * *', cleanupInvalidTokens); // 2 AM diariamente
```

### **8.2 Fallback para Notificaciones Fallidas**

```javascript
// Función para reintentar notificaciones fallidas
async function retryFailedNotifications() {
  try {
    console.log('🔄 Reintentando notificaciones fallidas...');
    
    const failedNotifications = await NotificationHistory.findAll({
      where: { 
        status: 'failed',
        created_at: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Últimas 24 horas
      }
    });
    
    console.log(`📱 Encontradas ${failedNotifications.length} notificaciones fallidas`);
    
    for (const failed of failedNotifications) {
      try {
        // Obtener información del usuario
        const user = await User.findByPk(failed.user_id);
        if (!user) continue;
        
        // Reintentar envío
        const result = await sendPushNotification(failed.user_id, {
          title: failed.title,
          body: failed.body,
          data: failed.data
        });
        
        if (result.success) {
          await failed.update({ 
            status: 'retried',
            retry_count: (failed.retry_count || 0) + 1
          });
          console.log(`✅ Notificación ${failed.id} reenviada exitosamente`);
        }
        
      } catch (error) {
        console.error(`❌ Error al reintentar notificación ${failed.id}:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en reintento de notificaciones:', error);
  }
}

// Ejecutar reintentos cada 15 minutos
cron.schedule('*/15 * * * *', retryFailedNotifications);
```

---

## 📊 **PASO 9: Métricas y Analytics**

### **9.1 Dashboard de Notificaciones**

```javascript
// Endpoint para dashboard de notificaciones
app.get('/api/notifications/dashboard', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Estadísticas por día
    const dailyStats = await NotificationHistory.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('COUNT', sequelize.fn('CASE', { when: { status: 'sent' }, then: 1 })), 'sent'],
        [sequelize.fn('COUNT', sequelize.fn('CASE', { when: { status: 'failed' }, then: 1 })), 'failed']
      ],
      where: {
        created_at: { [Op.between]: [start, end] }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
    });
    
    // Estadísticas por tipo
    const typeStats = await NotificationHistory.findAll({
      attributes: [
        [sequelize.fn('JSON_EXTRACT', sequelize.col('data'), '$.type'), 'type'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: { [Op.between]: [start, end] }
      },
      group: [sequelize.fn('JSON_EXTRACT', sequelize.col('data'), '$.type')]
    });
    
    res.json({
      period: { start, end },
      dailyStats,
      typeStats,
      summary: {
        total: dailyStats.reduce((sum, day) => sum + parseInt(day.dataValues.total), 0),
        sent: dailyStats.reduce((sum, day) => sum + parseInt(day.dataValues.sent), 0),
        failed: dailyStats.reduce((sum, day) => sum + parseInt(day.dataValues.failed), 0)
      }
    });
    
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

---

## 🔒 **PASO 10: Seguridad y Rate Limiting**

### **10.1 Rate Limiting**

```javascript
import rateLimit from 'express-rate-limit';

// Rate limiting para endpoints de notificaciones
const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas solicitudes de notificaciones. Intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Aplicar a endpoints de notificaciones
app.use('/api/notifications/*', notificationLimiter);

// Rate limiting específico para envío masivo
const bulkNotificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 envíos masivos por hora
  message: {
    error: 'Demasiados envíos masivos. Intenta de nuevo más tarde.'
  }
});

app.use('/api/notifications/send-promotion', bulkNotificationLimiter);
```

### **10.2 Validación de Datos**

```javascript
// Middleware de validación para notificaciones
const validateNotificationData = (req, res, next) => {
  const { title, body, data } = req.body;
  
  if (!title || typeof title !== 'string' || title.length > 255) {
    return res.status(400).json({ 
      error: 'Título inválido o demasiado largo (máximo 255 caracteres)' 
    });
  }
  
  if (!body || typeof body !== 'string' || body.length > 1000) {
    return res.status(400).json({ 
      error: 'Cuerpo inválido o demasiado largo (máximo 1000 caracteres)' 
    });
  }
  
  if (data && typeof data !== 'object') {
    return res.status(400).json({ 
      error: 'Los datos deben ser un objeto válido' 
    });
  }
  
  next();
};

// Aplicar validación
app.use('/api/notifications/send', validateNotificationData);
app.use('/api/notifications/send-promotion', validateNotificationData);
```

---

## 📱 **PASO 11: Integración con la App Móvil**

### **11.1 Configuración en la App**

Tu app móvil ya está configurada para recibir notificaciones. Solo asegúrate de que:

1. **Registre el token** cuando el usuario inicie sesión
2. **Envíe el token** al endpoint `/api/notifications/register-device`
3. **Maneje las notificaciones** recibidas para navegación

### **11.2 Ejemplo de Registro desde la App**

```typescript
// En tu app móvil (ya implementado)
const setupNotifications = async () => {
  try {
    // Registrar para notificaciones push
    const token = await registerForPushNotifications();
    if (token) {
      console.log('Dispositivo registrado para notificaciones push');
      
      // ENVIAR ESTE TOKEN A TU BACKEND
      await sendTokenToBackend(token.data);
    }
  } catch (error) {
    console.error('Error al configurar notificaciones:', error);
  }
};

const sendTokenToBackend = async (token: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/notifications/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
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

---

## 🚀 **PASO 12: Despliegue y Monitoreo**

### **12.1 Variables de Entorno de Producción**

```env
# .env.production
EXPO_PUSH_URL=https://exp.host/--/api/v2/push/send
EXPO_PROJECT_ID=be5bed90-b3e3-4c8b-95d4-e5595057a604
NODE_ENV=production
NOTIFICATION_LOG_LEVEL=info
MAX_RETRY_ATTEMPTS=3
BATCH_SIZE=100
```

### **12.2 Health Check**

```javascript
// Endpoint de health check para notificaciones
app.get('/api/notifications/health', async (req, res) => {
  try {
    // Verificar conexión con Expo
    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'ExponentPushToken[test]' })
    });
    
    const expoStatus = expoResponse.ok ? 'healthy' : 'unhealthy';
    
    // Verificar base de datos
    const dbStatus = await DeviceToken.count() >= 0 ? 'healthy' : 'unhealthy';
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        expo: expoStatus,
        database: dbStatus
      },
      stats: {
        activeDevices: await DeviceToken.count({ where: { is_active: true } }),
        lastNotification: await NotificationHistory.max('created_at')
      }
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

---

## 📋 **Checklist de Implementación**

### **✅ Fase 1: Configuración Básica**
- [ ] Instalar dependencias necesarias
- [ ] Configurar variables de entorno
- [ ] Crear tablas de base de datos
- [ ] Implementar endpoints de registro de dispositivos

### **✅ Fase 2: Funcionalidad Core**
- [ ] Implementar función de envío de notificaciones
- [ ] Crear notificaciones de cambio de estado de pedidos
- [ ] Implementar notificaciones de confirmación de pago
- [ ] Agregar notificaciones de seguimiento de delivery

### **✅ Fase 3: Funcionalidades Avanzadas**
- [ ] Implementar envío masivo de notificaciones
- [ ] Crear sistema de notificaciones programadas
- [ ] Agregar manejo de reintentos y fallbacks
- [ ] Implementar rate limiting y validaciones

### **✅ Fase 4: Testing y Monitoreo**
- [ ] Crear endpoints de prueba
- [ ] Implementar logging y métricas
- [ ] Configurar health checks
- [ ] Realizar pruebas de carga

### **✅ Fase 5: Despliegue**
- [ ] Configurar variables de producción
- [ ] Implementar monitoreo en tiempo real
- [ ] Configurar alertas automáticas
- [ ] Documentar para el equipo

---

## 🎯 **Resumen de Endpoints Implementados**

| Endpoint | Método | Descripción |
|----------|---------|-------------|
| `/api/notifications/register-device` | POST | Registrar dispositivo para notificaciones |
| `/api/notifications/unregister-device` | DELETE | Desregistrar dispositivo |
| `/api/notifications/send` | POST | Enviar notificación a usuario específico |
| `/api/notifications/send-promotion` | POST | Enviar notificación masiva |
| `/api/notifications/test` | POST | Enviar notificación de prueba |
| `/api/notifications/stats` | GET | Estadísticas de notificaciones |
| `/api/notifications/dashboard` | GET | Dashboard con métricas detalladas |
| `/api/notifications/health` | GET | Health check del sistema |

---

## 🚀 **¡Listo para Implementar!**

Con esta guía tienes **todo lo necesario** para implementar un sistema completo de notificaciones push desde tu backend. 

**Beneficios de esta implementación:**
- 🔔 **Notificaciones en tiempo real** para todos los estados de pedidos
- 💳 **Confirmaciones automáticas** de pagos
- 📦 **Seguimiento completo** del delivery
- 📊 **Métricas y analytics** detallados
- 🛡️ **Seguridad y rate limiting** implementados
- 🔄 **Sistema robusto** con reintentos y fallbacks

**¿Tienes alguna pregunta específica sobre la implementación o necesitas ayuda con algún paso en particular?** 🤔

---

**¡Tu app Veciapp estará lista para mantener a los usuarios informados en tiempo real!** 🎉
