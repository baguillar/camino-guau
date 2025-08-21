import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4]

  if (!email || !password || !name) {
    console.error('❌ Uso: yarn create-admin <email> <password> <name>')
    console.error('📝 Ejemplo: yarn create-admin bea.aguilar@icloud.com admin123 "Admin Camino"')
    process.exit(1)
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.error(`❌ El usuario con email ${email} ya existe`)
      
      // Opción: Convertir usuario existente a admin
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      })
      
      console.log('✅ Usuario existente convertido a administrador:')
      console.log(`📧 Email: ${updated.email}`)
      console.log(`👤 Nombre: ${updated.name}`)
      console.log(`🛡️ Rol: ${updated.role}`)
      return
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear nuevo usuario admin
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        totalKilometers: 0,
        totalWalks: 0,
      },
    })

    console.log('🎉 ¡Usuario administrador creado exitosamente!')
    console.log('📧 Email:', adminUser.email)
    console.log('👤 Nombre:', adminUser.name)
    console.log('🛡️ Rol:', adminUser.role)
    console.log('🔑 Contraseña:', password)
    
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()