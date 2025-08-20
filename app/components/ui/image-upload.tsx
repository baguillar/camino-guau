
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  type: 'user' | 'dog';
  dogId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ImageUpload({ 
  currentImage, 
  onImageChange, 
  type, 
  dogId, 
  className = '',
  size = 'md'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones del lado del cliente
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande (máximo 5MB)');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Solo JPG, PNG y WebP');
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      if (dogId) {
        formData.append('dogId', dogId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onImageChange(result.imageUrl);
        toast.success('Imagen subida exitosamente');
        // Limpiar el preview temporal
        URL.revokeObjectURL(previewUrl);
      } else {
        setPreview(currentImage || null);
        toast.error(result.error || 'Error subiendo imagen');
      }
    } catch (error) {
      setPreview(currentImage || null);
      toast.error('Error subiendo imagen');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange('');
    toast.success('Imagen eliminada');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-dashed border-gray-300 hover:border-orange-400 transition-colors group`}>
        <AnimatePresence>
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full h-full"
            >
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={openFileDialog}
                    disabled={isUploading}
                    className="p-2"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={openFileDialog}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    {size === 'sm' ? 'Foto' : 'Subir foto'}
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Información adicional */}
      {size !== 'sm' && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Máximo 5MB • JPG, PNG, WebP
        </p>
      )}
    </div>
  );
}
