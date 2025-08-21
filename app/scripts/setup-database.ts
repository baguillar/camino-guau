
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🚀 Setting up database for Vercel deployment...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await prisma.user.upsert({
      where: { email: 'bea.aguilar@icloud.com' },
      update: {},
      create: {
        email: 'bea.aguilar@icloud.com'',
        password: adminPassword,
        name: 'Beatriz',
        role: 'ADMIN',
        totalKilometers: 0,
        totalWalks: 0,
      },
    })

    console.log('✅ Admin user created:', adminUser.email)

    // Create demo user
    const demoPassword = await bcrypt.hash('demo123', 12)
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@caminoguau.com' },
      update: {},
      create: {
        email: 'demo@caminoguau.com',
        password: demoPassword,
        name: 'Usuario Demo',
        role: 'USER',
        totalKilometers: 15.5,
        totalWalks: 8,
        currentStreak: 3,
        bestStreak: 5,
        lastWalkDate: new Date(),
      },
    })

    console.log('✅ Demo user created:', demoUser.email)

    // Create sample event routes
    const now = new Date()
    const sampleRoutes = [
      {
        name: 'Ruta del Parque Central',
        description: 'Un hermoso paseo por el parque central de la ciudad, perfecto para perros de todas las edades.',
        location: 'Parque Central, Madrid',
        distance: 2.5,
        difficulty: 'EASY',
        eventDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        maxParticipants: 20,
        entryPrice: 5.00,
        requiresConfirmation: true,
      },
      {
        name: 'Sendero de la Dehesa',
        description: 'Ruta natural por la dehesa con zonas de sombra y arroyos donde los perros pueden refrescarse.',
        location: 'Dehesa de la Villa, Madrid',
        distance: 4.2,
        difficulty: 'MEDIUM',
        eventDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        maxParticipants: 15,
        entryPrice: 8.00,
        requiresConfirmation: true,
      },
    ]

    for (const route of sampleRoutes) {
      const existingRoute = await prisma.eventRoute.findFirst({
        where: { name: route.name }
      })
      
      if (!existingRoute) {
        await prisma.eventRoute.create({
          data: route,
        })
      }
    }

    console.log('✅ Sample event routes created')

    // Create app configuration
    const appConfigs = [
      { key: 'app_name', value: 'Camino Guau' },
      { key: 'app_version', value: '2.0.0' },
      { key: 'default_walk_goal', value: '5' },
    ]

    for (const config of appConfigs) {
      await prisma.appConfig.upsert({
        where: { key: config.key },
        update: { value: config.value },
        create: config,
      })
    }

    console.log('✅ App configuration created')
    console.log('🎉 Database setup completed successfully!')

    console.log('\n📋 CREDENTIALS:')
    console.log('Admin: bea.aguilar@icloud.com / admin123')
    console.log('Demo: demo@caminoguau.com / demo123')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  setupDatabase()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default setupDatabase
