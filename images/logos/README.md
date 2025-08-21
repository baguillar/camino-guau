
# Logos de Camino Guau 🐕

## Estructura de Archivos

### Logos Principales
- `logo-principal.png` - Logo principal de la aplicación (recomendado: 400x120px)
- `logo-blanco.png` - Logo para fondos oscuros (mismo tamaño)
- `logo-icon.png` - Icono cuadrado (recomendado: 512x512px)
- `logo-horizontal.png` - Logo horizontal para headers (recomendado: 300x80px)

### Iconos PWA
- `favicon.ico` - Icono del navegador (32x32px)
- `icon-192x192.png` - Icono PWA pequeño
- `icon-512x512.png` - Icono PWA grande
- `apple-touch-icon.png` - Icono para iOS (180x180px)

## Cómo Usar en Componentes

```tsx
import Image from 'next/image';

// Logo principal
<Image 
  src="/images/logos/logo-principal.png"
  alt="Camino Guau"
  width={200}
  height={60}
  priority // Para logos importantes
/>

// Logo responsive
<Image 
  src="/images/logos/logo-horizontal.png"
  alt="Camino Guau"
  fill
  className="object-contain"
/>
```

## Formatos Recomendados
- **PNG**: Para logos con transparencia
- **SVG**: Para iconos escalables
- **WebP**: Para mejor compresión (Next.js convierte automáticamente)

## Tamaños Recomendados
- Logo principal: 400x120px (ratio 10:3)
- Logo horizontal: 300x80px (ratio 15:4)
- Icono cuadrado: 512x512px
- Favicon: 32x32px o 48x48px
