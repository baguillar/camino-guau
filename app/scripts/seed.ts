

import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Iniciando proceso de seed...')

  // Create test admin user
  const adminPassword = await bcrypt.hash('johndoe123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: adminPassword,
      role: 'ADMIN',
      totalKilometers: 150.5,
      totalWalks: 45,
      currentStreak: 7,
      bestStreak: 21
    }
  })

  console.log('✅ Usuario admin creado:', admin.email)

  // Create sample achievements
  const achievements = [
    {
      name: 'Primer Paso',
      description: 'Completa tu primer paseo',
      icon: '👣',
      category: 'WALKS',
      walksRequired: 1,
      sortOrder: 1
    },
    {
      name: 'Caminante',
      description: 'Completa 10 paseos',
      icon: '🚶',
      category: 'WALKS',
      walksRequired: 10,
      sortOrder: 2
    },
    {
      name: 'Explorador',
      description: 'Camina 5 kilómetros',
      icon: '🗺️',
      category: 'DISTANCE',
      kmRequired: 5,
      sortOrder: 3
    },
    {
      name: 'Maratonista',
      description: 'Camina 50 kilómetros',
      icon: '🏃',
      category: 'DISTANCE',
      kmRequired: 50,
      sortOrder: 4
    },
    {
      name: 'Constante',
      description: 'Mantén una racha de 7 días',
      icon: '🔥',
      category: 'STREAK',
      streakRequired: 7,
      sortOrder: 5
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement
    })
  }

  console.log('✅ Logros creados')

  // Create sample event route
  const eventRoute = await prisma.eventRoute.upsert({
    where: { id: 'sample-event-route' },
    update: {},
    create: {
      id: 'sample-event-route',
      name: 'Paseo por el Parque Central',
      description: 'Un hermoso paseo familiar por el parque central de la ciudad',
      location: 'Parque Central, Madrid',
      distance: 3.5,
      difficulty: 'EASY',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      maxParticipants: 20,
      entryPrice: 0,
      requiresConfirmation: true
    }
  })

  console.log('✅ Ruta de evento creada')

  // Create sample walk for admin
  await prisma.walk.create({
    data: {
      userId: admin.id,
      kilometers: 5.2,
      duration: 45,
      date: new Date(),
      notes: 'Paseo matutino por el barrio',
      weather: 'Soleado',
      dogMood: 'Feliz'
    }
  })

  console.log('✅ Paseo de ejemplo creado')

  // Create app config
  await prisma.appConfig.upsert({
    where: { key: 'app_version' },
    update: {},
    create: {
      key: 'app_version',
      value: '1.0.0'
    }
  })

  console.log('✅ Configuración de app creada')
  console.log('🎉 Seed completado exitosamente!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
