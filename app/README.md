
# 🐕 Camino Guau - Aplicación Web

Una aplicación web progresiva (PWA) que gamifica las caminatas con perros, inspirada en el Camino de Santiago.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Registro de kilómetros**: Sistema automático de tracking de distancia
- **Gamificación**: Sistema de niveles, logros y sellos coleccionables
- **Eventos**: Caminatas organizadas con código QR para verificación
- **Ranking**: Sistema de comunidad y competencias amistosas
- **PWA**: Instalable en dispositivos móviles con notificaciones push

### 📱 Características Móviles
- **100% Responsivo**: Optimizado para móviles y tablets
- **Subida de imágenes**: Fotos de perfil para usuarios y perros
- **Límites de tamaño**: Máximo 5MB por imagen
- **Formatos soportados**: JPG, PNG, WebP

### 🎖️ Sistema de Logros
- **Medalla de bienvenida**: Se otorga automáticamente al completar el registro
- **Logros por kilómetros**: Desde Explorador Novato hasta Leyenda del Camino
- **Sellos coleccionables**: Sistema de rareza (común, raro, épico, legendario)
- **Progresión expandida**: Sistema que continúa más allá de los 100km

### 🔧 Tecnologías
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Animaciones**: Framer Motion
- **Notificaciones**: Push notifications via PWA

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- Yarn

### Configuración
1. Instalar dependencias:
```bash
cd app
yarn install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

3. Configurar base de datos:
```bash
npx prisma db push
yarn seed
```

4. Ejecutar en desarrollo:
```bash
yarn dev
```

## 📊 Base de Datos

### Modelos Principales
- **User**: Información de usuarios y autenticación
- **Dog**: Perfiles de perros vinculados a usuarios
- **Event**: Eventos de caminatas organizadas
- **UserProgress**: Progreso del usuario (km, eventos, sellos)
- **Achievement**: Sistema de logros y medallas
- **Stamp**: Sellos digitales coleccionables
- **Attendance**: Registro de asistencia a eventos

## 🎮 Sistema de Gamificación

### Niveles por Kilómetros
- **0-24 km**: Explorador Novato
- **25-49 km**: Caminante Bronce
- **50-99 km**: Caminante Plata
- **100-149 km**: Caminante Oro
- **150-199 km**: Peregrino Experto
- **200-299 km**: Explorador Avanzado
- **300-499 km**: Caminante Heroico
- **500-749 km**: Aventurero Épico
- **750-999 km**: Explorador Supremo
- **1000+ km**: Gran Caminante / Leyenda del Camino

### Categorías de Sellos
- **🎒 Aventura**: Exploración y senderismo
- **🏃‍♀️ Kilómetros**: Logros basados en distancia
- **🌲 Naturaleza**: Conexión con el medio ambiente
- **🌸 Temporadas**: Eventos estacionales
- **⭐ Especiales**: Sellos únicos y eventos especiales

## 📱 Funcionalidades Móviles

### Subida de Imágenes
- Límite de 5MB por archivo
- Formatos: JPG, PNG, WebP
- Preview en tiempo real
- Almacenamiento en directorio `uploads/`
- Servicio automático de archivos via API

### Responsividad
- Navegación adaptativa por pestañas
- Componentes móviles específicos
- Grid responsivo para estadísticas
- Imágenes optimizadas con Next.js

## 🔐 Autenticación

### Credenciales de Prueba
- **Email**: john@doe.com
- **Password**: johndoe123

### Datos de Prueba Incluidos
- Usuario con perfil completo
- Perro "Buddy" (Golden Retriever) 
- 35 km recorridos
- 2 eventos completados
- 2 sellos coleccionados
- Varios logros desbloqueados

## 🎯 Próximas Características
- Sistema de amigos y grupos
- Mapas interactivos con rutas
- Integración con wearables
- Chat en tiempo real durante eventos
- Sistema de recompensas físicas

## 📄 Licencia
Este proyecto está bajo licencia privada para Camino Guau.

## 🤝 Contribuciones
Para contribuir al proyecto, contacta con el equipo de desarrollo.

---
**¡Hecho con ❤️ para los amantes de los perros y las aventuras al aire libre!**
