
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para Vercel
  distDir: '.next',
  
  experimental: {
    // Remover outputFileTracingRoot que puede causar problemas en Vercel
    serverComponentsExternalPackages: ['prisma'],
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Optimización de imágenes para Vercel
  images: { 
    unoptimized: false, // Cambiar a false para optimización en Vercel
    domains: [], // Agregar dominios externos si es necesario
  },
  
  // Configuración de headers para PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configuración para archivos estáticos
  async rewrites() {
    return [
      {
        source: '/api/files/:path*',
        destination: '/api/files/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
