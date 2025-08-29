
import { PrismaClient, AchievementCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin test user (hidden credentials)
  const adminPassword = await bcrypt.hash('johndoe123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      totalKilometers: 0,
      totalWalks: 0,
    },
  })

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

  console.log('✅ Created users')

  // Create initial achievements including welcome achievement
  const achievements = [
    {
      name: 'Bienvenida',
      description: '¡Bienvenido a Camino Guau! Gracias por unirte a nuestra comunidad',
      icon: 'heart',
      category: AchievementCategory.SPECIAL,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 0,
    },
    {
      name: 'Primer Paso',
      description: 'Completa tu primera caminata',
      icon: 'paw-print',
      category: AchievementCategory.WALKS,
      kmRequired: null,
      walksRequired: 1,
      streakRequired: null,
      sortOrder: 1,
    },
    {
      name: 'Explorador Novato',
      description: 'Camina 5 kilómetros en total',
      icon: 'map',
      category: AchievementCategory.DISTANCE,
      kmRequired: 5,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 2,
    },
    {
      name: 'Aventurero',
      description: 'Completa 10 caminatas',
      icon: 'map',
      category: AchievementCategory.WALKS,
      kmRequired: null,
      walksRequired: 10,
      streakRequired: null,
      sortOrder: 3,
    },
    {
      name: 'Constancia',
      description: 'Mantén una racha de 5 días',
      icon: 'calendar',
      category: AchievementCategory.STREAK,
      kmRequired: null,
      walksRequired: null,
      streakRequired: 5,
      sortOrder: 4,
    },
    {
      name: 'Maratonista Canino',
      description: 'Camina 25 kilómetros en total',
      icon: 'trophy',
      category: AchievementCategory.DISTANCE,
      kmRequired: 25,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 5,
    },
    {
      name: 'Veterano del Paseo',
      description: 'Completa 25 caminatas',
      icon: 'medal',
      category: AchievementCategory.WALKS,
      kmRequired: null,
      walksRequired: 25,
      streakRequired: null,
      sortOrder: 6,
    },
    {
      name: 'Dedicación Total',
      description: 'Mantén una racha de 10 días',
      icon: 'crown',
      category: AchievementCategory.STREAK,
      kmRequired: null,
      walksRequired: null,
      streakRequired: 10,
      sortOrder: 7,
    },
    {
      name: 'Explorador Experto',
      description: 'Camina 50 kilómetros en total',
      icon: 'trophy',
      category: AchievementCategory.DISTANCE,
      kmRequired: 50,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 8,
    },
    {
      name: 'Maestro del Paseo',
      description: 'Completa 50 caminatas',
      icon: 'crown',
      category: AchievementCategory.WALKS,
      kmRequired: null,
      walksRequired: 50,
      streakRequired: null,
      sortOrder: 9,
    },
    {
      name: 'Leyenda Canina',
      description: 'Camina 100 kilómetros en total',
      icon: 'medal',
      category: AchievementCategory.DISTANCE,
      kmRequired: 100,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 10,
    },
    
    // Chapas de Constancia - EventosGuau
    {
      name: 'Participante EventosGuau',
      description: 'Completa tu primera ruta de EventosGuau',
      icon: 'map-pin',
      category: AchievementCategory.EVENTROUTE,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 11,
    },
    {
      name: 'Chapa de Constancia - Bronce',
      description: 'Participa en 2 rutas EventosGuau consecutivas',
      icon: 'shield',
      category: AchievementCategory.CONSTANCY,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 12,
    },
    {
      name: 'Chapa de Constancia - Plata',
      description: 'Participa en 3 rutas EventosGuau consecutivas',
      icon: 'award',
      category: AchievementCategory.CONSTANCY,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 13,
    },
    {
      name: 'Chapa de Constancia - Oro',
      description: 'Participa en 5 rutas EventosGuau consecutivas',
      icon: 'crown',
      category: AchievementCategory.CONSTANCY,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 14,
    },
    {
      name: 'Explorador de Rutas',
      description: 'Completa 5 rutas diferentes de EventosGuau',
      icon: 'map',
      category: AchievementCategory.EVENTROUTE,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 15,
    },
    {
      name: 'Maestro de EventosGuau',
      description: 'Completa 10 rutas diferentes de EventosGuau',
      icon: 'trophy',
      category: AchievementCategory.EVENTROUTE,
      kmRequired: null,
      walksRequired: null,
      streakRequired: null,
      sortOrder: 16,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    })
  }

  console.log('✅ Created achievements')

  // Grant welcome achievement to all existing users
  const welcomeAchievement = await prisma.achievement.findUnique({
    where: { name: 'Bienvenida' }
  })

  if (welcomeAchievement) {
    const allUsers = await prisma.user.findMany()
    
    for (const user of allUsers) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: user.id,
            achievementId: welcomeAchievement.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          achievementId: welcomeAchievement.id,
          progress: 100,
        },
      })
    }
    
    console.log('✅ Granted welcome achievement to all users')
  }

  // Create some demo walks for demo user
  const demoWalks = [
    { kilometers: 2.5, duration: 30, notes: 'Paseo matutino por el parque' },
    { kilometers: 3.0, duration: 45, notes: 'Caminata por el barrio' },
    { kilometers: 1.8, duration: 25, notes: 'Paseo rápido antes del trabajo' },
    { kilometers: 4.2, duration: 60, notes: 'Ruta larga por el bosque' },
    { kilometers: 2.0, duration: 35, notes: 'Paseo vespertino' },
    { kilometers: 2.0, duration: 30, notes: 'Caminata de fin de semana' },
  ]

  for (let i = 0; i < demoWalks.length; i++) {
    const walk = demoWalks[i]
    await prisma.walk.create({
      data: {
        userId: demoUser.id,
        kilometers: walk.kilometers,
        duration: walk.duration,
        notes: walk.notes,
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), // Last 6 days
      },
    })
  }

  console.log('✅ Created demo walks')

  // Create app configuration
  const appConfigs = [
    { key: 'app_name', value: 'Camino Guau' },
    { key: 'app_version', value: '2.0.0' },
    { key: 'default_walk_goal', value: '5' },
    { key: 'min_walk_distance', value: '0.1' },
    { key: 'max_walk_distance', value: '50' },
  ]

  for (const config of appConfigs) {
    await prisma.appConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }

  console.log('✅ Created app configuration')

  // Create sample EventosGuau routes
  const now = new Date()
  const sampleRoutes = [
    {
      name: 'Ruta del Parque Central',
      description: 'Un hermoso paseo por el parque central de la ciudad, perfecto para perros de todas las edades.',
      location: 'Parque Central, Madrid',
      distance: 2.5,
      difficulty: 'EASY',
      eventDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
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
      eventDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // In 10 days
      maxParticipants: 15,
      entryPrice: 8.00,
      requiresConfirmation: true,
    },
    {
      name: 'Ruta Costera Matinal',
      description: 'Caminata por la costa durante las primeras horas del día. Ideal para perros activos.',
      location: 'Paseo Marítimo, Valencia',
      distance: 3.8,
      difficulty: 'MEDIUM',
      eventDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
      maxParticipants: 25,
      entryPrice: 6.00,
      requiresConfirmation: true,
    },
    {
      name: 'Aventura Montañera',
      description: 'Para los más aventureros: ruta de montaña con vistas espectaculares. Solo para perros en buena forma física.',
      location: 'Sierra de Guadarrama',
      distance: 6.5,
      difficulty: 'HARD',
      eventDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // In 3 weeks
      maxParticipants: 10,
      entryPrice: 12.00,
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

  console.log('✅ Created sample EventosGuau routes')

  // Check and create user achievements for demo user
  const userAchievements = await prisma.achievement.findMany({
    where: {
      OR: [
        { walksRequired: { lte: demoUser.totalWalks } },
        { kmRequired: { lte: demoUser.totalKilometers } },
        { streakRequired: { lte: demoUser.currentStreak } },
        { name: 'Bienvenida' }, // Always grant welcome achievement
      ],
    },
  })

  for (const achievement of userAchievements) {
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId: demoUser.id,
          achievementId: achievement.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        achievementId: achievement.id,
        progress: 100,
      },
    })
  }

  console.log('✅ Created user achievements')
  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
