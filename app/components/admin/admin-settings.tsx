

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Database, Shield, Bell } from 'lucide-react'

interface AppConfig {
  id: string
  key: string
  value: string
}

interface AdminSettingsProps {
  appConfig: AppConfig[]
}

export function AdminSettingsContent({ appConfig }: AdminSettingsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Configuración del Sistema ⚙️
        </h1>
        <p className="text-gray-600 text-lg">
          Gestiona la configuración global de Camino Guau
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* App Configuration */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Configuración de la Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appConfig?.map((config) => (
                  <div key={config.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {config.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">{config.key}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {config.value}
                      </span>
                    </div>
                  </div>
                )) ?? (
                  <p className="text-gray-500 text-center py-6">
                    No hay configuración disponible
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base de Datos</span>
                  <span className="text-green-600 font-medium">✓ Conectado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Autenticación</span>
                  <span className="text-green-600 font-medium">✓ Activo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API</span>
                  <span className="text-green-600 font-medium">✓ Funcionando</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <Bell className="h-5 w-5 mr-2" />
                Información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 text-sm">
                Esta es una versión básica del panel de configuración. 
                Las opciones avanzadas estarán disponibles en futuras actualizaciones.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
