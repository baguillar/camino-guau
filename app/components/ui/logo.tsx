
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'icon' | 'horizontal' | 'principal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const LOGO_VARIANTS = {
  icon: '/logo-192x192.png',
  horizontal: '/logo-512x512.png', 
  principal: '/logo-512x512.png'
};

const FALLBACK_LOGO = "/logo-512x512.png";

const SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export function Logo({ 
  variant = 'icon', 
  size = 'md', 
  className,
  priority = false 
}: LogoProps) {
  const [hasError, setHasError] = useState(false);
  
  const logoSrc = hasError ? FALLBACK_LOGO : LOGO_VARIANTS[variant];
  
  return (
    <div className={cn("relative", SIZE_CLASSES[size], className)}>
      <Image
        src={logoSrc}
        alt="Camino Guau"
        fill
        className="object-contain"
        priority={priority}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
