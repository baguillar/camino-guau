
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Code, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function RedeemCodeDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error('Introduce un código válido');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data);
        toast.success(`¡${data.kilometers} km añadidos a tu progreso!`);
        // Recargar la página después de 3 segundos para mostrar el progreso actualizado
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.error || 'Error al canjear el código');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setCode('');
    setSuccess(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span className="hidden sm:inline">Canjear Código</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Canjear Código de Entrada
          </DialogTitle>
          <DialogDescription>
            Introduce el código que recibiste con tu entrada para añadir kilómetros a tu progreso.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  placeholder="GUAU-XXXXXXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="text-center font-mono text-lg tracking-wider"
                  maxLength={13}
                />
                <p className="text-sm text-gray-500 text-center">
                  Formato: GUAU-XXXXXXXX
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRedeem}
                  disabled={isLoading || !code.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Canjeando...' : 'Canjear Código'}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">¿Dónde encuentro mi código?</p>
                    <p>El código viene incluido en tu entrada del evento. Búscalo en tu email de confirmación o ticket físico.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  ¡Código canjeado exitosamente!
                </h3>
                <p className="text-gray-600 mt-1">
                  Se han añadido <span className="font-bold text-green-600">{success.kilometers} km</span> del evento "<span className="font-medium">{success.eventName}</span>" a tu progreso.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Total acumulado:</span> {success.totalKilometers} km
                </p>
              </div>

              <Button onClick={resetDialog} className="w-full">
                ¡Genial!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
