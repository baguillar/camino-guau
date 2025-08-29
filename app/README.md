

# Camino Guau - Aplicación de Paseos para Perros

Una aplicación completa para registrar paseos con perros, gestionar información de mascotas, y participar en eventos comunitarios.

## 🐕 Características Principales

### ✨ Gestión de Perros
- **Registro completo de perros**: Nombre, raza, sexo, edad, foto
- **Características de comportamiento**: Obediencia, socialización con perros y personas
- **Características especiales**: Campo libre para información adicional
- **Subida de imágenes**: Fotos de alta calidad para cada perro
- **Gestión múltiple**: Soporte para múltiples perros por usuario

### 🚶 Registro de Paseos
- Registro de kilómetros, duración y notas
- Información del clima y estado de ánimo del perro
- Tracking de rachas y estadísticas personales
- Historial completo de paseos

### 🏆 Sistema de Logros
- Logros basados en distancia, número de paseos y constancia
- Sistema de progreso y desbloqueados
- Categorías diversas de logros

### 📅 EventosGuau
- Eventos comunitarios de paseos
- Sistema de inscripciones y confirmaciones
- Rutas con diferentes niveles de dificultad
- Gestión de participantes y feedback

### 👨‍💼 Panel de Administración
- **Dashboard completo** con estadísticas en tiempo real
- **Gestión de usuarios** y sus datos
- **Gestión de eventos** y rutas
- **Sistema de logros** configurable
- **Estadísticas avanzadas** con gráficos interactivos

## 🔧 Tecnologías Utilizadas

- **Next.js 14.2.28** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **PostgreSQL** (Neon) - Base de datos
- **NextAuth.js** - Autenticación
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes de UI
- **Recharts** - Gráficos interactivos
- **Framer Motion** - Animaciones

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_REPOSITORIO]
cd camino-guau
```

### 2. Instalar dependencias
```bash
yarn install
```

### 3. Configurar variables de entorno
Crear archivo `.env` con:

```env
# Base de datos
POSTGRES_PRISMA_URL="postgresql://..."
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[NEXTAUTH_SECRET_RANDOM]"

# Stack Auth (opcional)
NEXT_PUBLIC_STACK_PROJECT_ID="[STACK_PROJECT_ID]"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="[STACK_CLIENT_KEY]"
STACK_SECRET_SERVER_KEY="[STACK_SERVER_KEY]"
```

### 4. Configurar base de datos
```bash
# Generar cliente Prisma
yarn prisma generate

# Aplicar migraciones
yarn prisma db push

# Sembrar datos iniciales (opcional)
yarn prisma db seed
```

### 5. Ejecutar en desarrollo
```bash
yarn dev
```

## 📊 Estructura del Proyecto

```
app/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── profile/           # Perfil de usuario
│   ├── api/               # API routes
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Shadcn)
│   ├── dogs/             # Gestión de perros
│   ├── admin/            # Componentes de admin
│   └── ...
├── lib/                  # Utilidades y configuraciones
├── prisma/               # Esquema de base de datos
└── scripts/              # Scripts de utilidad
```

## 🗄️ Esquema de Base de Datos

### Modelos principales:
- **User**: Usuarios del sistema con estadísticas
- **Dog**: Información completa de perros
- **Walk**: Registro de paseos
- **Achievement**: Sistema de logros
- **EventRoute**: Rutas de eventos comunitarios
- **EventParticipant**: Participaciones en eventos

## 🔐 Autenticación y Roles

- **USER**: Usuario estándar con acceso a funcionalidades básicas
- **ADMIN**: Administrador con acceso al panel completo

### Usuario de prueba:
- Email: `john@doe.com`
- Password: `johndoe123`
- Rol: ADMIN

## 🐛 Solución de Problemas

### Errores comunes:

1. **Error de compilación TypeScript**: 
   - Verificar tipos en archivos de estadísticas
   - Ejecutar `yarn prisma generate`

2. **Problemas de base de datos**:
   - Verificar variables de entorno
   - Ejecutar `yarn prisma db push`

3. **Errores de autenticación**:
   - Verificar NEXTAUTH_SECRET
   - Limpiar cookies del navegador

## 📈 Características Técnicas

### Correcciones Implementadas:
- ✅ **Error TypeScript corregido** en admin/stats
- ✅ **Sistema completo de perros** implementado
- ✅ **Subida de imágenes** funcional
- ✅ **APIs RESTful** para gestión de datos
- ✅ **Componentes UI** modernos y responsivos
- ✅ **Crash prevention** con null safety
- ✅ **Esquema de BD** actualizado y compatible

### Funcionalidades de Perros:
- ✅ Formulario completo de registro
- ✅ Gestión de múltiples perros
- ✅ Subida y gestión de fotos
- ✅ Escalas de comportamiento (1-10)
- ✅ Características especiales personalizables
- ✅ CRUD completo con APIs

## 🚀 Deploy en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático con cada push

## 📝 Scripts Disponibles

- `yarn dev` - Modo desarrollo
- `yarn build` - Build de producción
- `yarn start` - Servidor de producción
- `yarn lint` - Linting
- `yarn prisma generate` - Generar cliente Prisma
- `yarn prisma db push` - Aplicar cambios a BD
- `yarn prisma db seed` - Sembrar datos iniciales

## 🎯 Próximas Mejoras

- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con GPS
- [ ] Social features avanzadas
- [ ] Análisis de datos con IA

---

**Desarrollado con ❤️ para la comunidad de amantes de los perros**
