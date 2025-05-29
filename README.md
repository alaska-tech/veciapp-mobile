# VeciApp

VeciApp es una aplicación móvil moderna desarrollada para conectar vendedores y clientes, ofreciendo una experiencia de usuario fluida y atractiva.

## 🚀 Características Principales

- **Multiplataforma**: Soporte para iOS, Android y Web
- **Diseño Moderno**: Interfaz de usuario intuitiva con soporte para modo claro y oscuro
- **Autenticación**: Sistema completo de registro y login
- **Roles de Usuario**: 
  - Cliente: Acceso a catálogo y compras
  - Vendedor: Gestión de productos y pedidos
  - Dashboard: Panel de administración
- **Carrito de Compras**: Gestión de productos y pedidos
- **Navegación Intuitiva**: Sistema de navegación por pestañas y rutas anidadas

## 🛠 Tecnologías Utilizadas

- **Frontend**:
  - React Native con Expo
  - TypeScript para tipo seguro
  - NativeWind v4 (Tailwind CSS para React Native)
  - Expo Router para navegación
  - Zustand para manejo de estado
  - React Native Reanimated para animaciones

- **UI/UX**:
  - Componentes primitivos de React Native
  - Fuentes personalizadas (Inter y Poppins)
  - Sistema de temas claro/oscuro
  - Barra de navegación adaptativa
  - Componentes reutilizables

## 📁 Estructura del Proyecto

```plaintext
veciapp/
├── app/                    # Pantallas y rutas de la aplicación
│   ├── (auth)/            # Pantallas de autenticación
│   ├── (client)/          # Pantallas para clientes
│   ├── (vendor)/          # Pantallas para vendedores
│   ├── (dashboard)/       # Panel de administración
│   └── (onboarding)/      # Pantallas de bienvenida
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de interfaz básicos
│   ├── auth/             # Componentes de autenticación
│   └── epic/             # Componentes complejos
├── store/                # Estado global (Zustand)
├── assets/              # Recursos estáticos
└── lib/                 # Utilidades y configuraciones
```

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd veciapp
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📱 Ejecución en Dispositivos

### iOS
1. Instala Expo Go desde la App Store
2. Escanea el código QR con la cámara del iPhone
3. Abre la aplicación en Expo Go

### Android
1. Instala Expo Go desde Google Play Store
2. Abre Expo Go y escanea el código QR
3. La aplicación se cargará automáticamente

## 🛠 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run dev:web` - Inicia la versión web
- `npm run dev:android` - Inicia la versión Android
- `npm run ios` - Inicia la versión iOS
- `npm run clean` - Limpia la caché y node_modules

## 🔧 Solución de Problemas

Si encuentras problemas durante el desarrollo:

1. Limpia la caché:
```bash
npm run clean
```

2. Reinstala las dependencias:
```bash
npm install
```

3. Reinicia el servidor con caché limpia:
```bash
npm run dev -- --clear
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

Desarrollado con ❤️ por Alaska Tech

