
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    }
  });

  // Crear progreso inicial para el usuario de prueba
  await prisma.userProgress.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      totalKilometers: 35,
      eventsCompleted: 2,
      stampsCollected: 2,
      currentLevel: 2,
      experiencePoints: 350,
    }
  });

  // Crear perro para el usuario de prueba
  const testDog = await prisma.dog.upsert({
    where: { id: testUser.id + '_dog' },
    update: {},
    create: {
      id: testUser.id + '_dog',
      name: 'Buddy',
      breed: 'Golden Retriever',
      image: 'https://www.naomijenkinart.com/images/naomi-uploads/gallery-riley-wm.jpg',
      userId: testUser.id,
    }
  });

  // Crear eventos de ejemplo
  const events = [
    {
      id: 'event_1',
      name: 'Caminata matinal en el parque',
      description: 'Una hermosa caminata por el parque central de la ciudad junto a nuestros amigos peludos.',
      date: new Date('2024-12-25T09:00:00Z'),
      location: 'Parque Central, Madrid',
      kilometers: 5.0,
      qrCode: 'QR_EVENT_1_2024',
      isActive: true,
    },
    {
      id: 'event_2', 
      name: 'Ruta del Camino de Santiago - Tramo 1',
      description: 'Primer tramo oficial del Camino de Santiago adaptado para perros. Desde Sarria hacia Portomarín.',
      date: new Date('2024-12-28T08:00:00Z'),
      location: 'Sarria, Lugo',
      kilometers: 22.5,
      qrCode: 'QR_CAMINO_TRAMO_1_2024',
      isActive: true,
    },
    {
      id: 'event_3',
      name: 'Encuentro canino navideño',
      description: 'Celebración especial de navidad con actividades para perros y sus familias humanas.',
      date: new Date('2024-12-31T10:30:00Z'),
      location: 'Plaza de la Villa, Segovia',
      kilometers: 3.5,
      qrCode: 'QR_NAVIDAD_2024',
      isActive: true,
    },
    {
      id: 'event_4',
      name: 'Ruta de los Miradores',
      description: 'Caminata por los mejores miradores naturales de la Sierra de Guadarrama.',
      date: new Date('2025-01-05T07:45:00Z'),
      location: 'Cercedilla, Madrid',
      kilometers: 15.0,
      qrCode: 'QR_MIRADORES_2025',
      isActive: true,
    },
    {
      id: 'event_5',
      name: 'Playa Canina - Ruta Costera',
      description: 'Aventura playera especial para perros. Caminata por la costa con paradas en playas pet-friendly.',
      date: new Date('2025-01-12T09:15:00Z'),
      location: 'Santander, Cantabria',
      kilometers: 8.5,
      qrCode: 'QR_PLAYA_2025',
      isActive: true,
    }
  ];

  for (const eventData of events) {
    await prisma.event.upsert({
      where: { id: eventData.id },
      update: {},
      create: eventData
    });
  }

  // Crear categorías de sellos
  const stampCategories = [
    {
      id: 'adventure',
      name: 'Aventura',
      description: 'Sellos relacionados con la exploración y aventuras',
      color: '#f97316',
      icon: '🎒'
    },
    {
      id: 'kilometers',
      name: 'Kilómetros',
      description: 'Logros basados en distancia recorrida',
      color: '#3b82f6',
      icon: '🏃‍♀️'
    },
    {
      id: 'nature',
      name: 'Naturaleza',
      description: 'Conexión con el mundo natural',
      color: '#10b981',
      icon: '🌲'
    },
    {
      id: 'seasons',
      name: 'Temporadas',
      description: 'Eventos estacionales especiales',
      color: '#8b5cf6',
      icon: '🌸'
    },
    {
      id: 'special',
      name: 'Especiales',
      description: 'Sellos únicos y de eventos especiales',
      color: '#f59e0b',
      icon: '⭐'
    }
  ];

  for (const categoryData of stampCategories) {
    await prisma.stampCategory.upsert({
      where: { id: categoryData.id },
      update: {},
      create: categoryData
    });
  }

  // Crear sellos digitales para eventos (usando los generados)
  const stamps = [
    // Aventura
    {
      id: 'explorador-novato',
      name: 'Explorador Novato',
      description: 'Tu primera aventura en el Camino Guau',
      image: '/images/stamp-6.png',
      eventId: 'event_1',
      categoryId: 'adventure',
      rarity: 'common'
    },
    {
      id: 'caminante-experto',
      name: 'Caminante Experto',
      description: 'Dominas el arte del senderismo canino',
      image: '/images/achievement-1.png',
      eventId: 'event_2',
      categoryId: 'adventure',
      rarity: 'rare'
    },
    {
      id: 'montanero-guau',
      name: 'Montañero Guau',
      description: 'Has conquistado las montañas',
      image: '/images/stamp-1.png',
      eventId: 'event_4',
      categoryId: 'adventure',
      rarity: 'epic'
    },
    {
      id: 'explorador-legendario',
      name: 'Explorador Legendario',
      description: 'Un verdadero pionero de aventuras',
      image: '/images/achievement-3.png',
      eventId: 'event_2',
      categoryId: 'adventure',
      rarity: 'legendary'
    },
    {
      id: 'aventurero-supremo',
      name: 'Aventurero Supremo',
      description: 'El máximo nivel de aventurero',
      image: '/images/stamp-7.png',
      eventId: 'event_4',
      categoryId: 'adventure',
      rarity: 'legendary'
    },
    // Kilómetros
    {
      id: 'primeros-pasos',
      name: 'Primeros Pasos',
      description: 'Cada gran viaje comienza con un paso',
      image: '/images/achievement-5.png',
      eventId: 'event_1',
      categoryId: 'kilometers',
      rarity: 'common'
    },
    {
      id: 'maratonista-canino',
      name: 'Maratonista Canino',
      description: 'La resistencia de un verdadero atleta',
      image: '/images/stamp-9.png',
      eventId: 'event_2',
      categoryId: 'kilometers',
      rarity: 'rare'
    },
    {
      id: 'ultra-runner',
      name: 'Ultra Runner',
      description: 'Superaste todos los límites',
      image: '/images/stamp-5.png',
      eventId: 'event_4',
      categoryId: 'kilometers',
      rarity: 'epic'
    },
    {
      id: 'corredor-infinito',
      name: 'Corredor Infinito',
      description: 'Tu resistencia no tiene límites',
      image: '/images/achievement-2.png',
      eventId: 'event_2',
      categoryId: 'kilometers',
      rarity: 'legendary'
    },
    // Naturaleza
    {
      id: 'amigo-del-bosque',
      name: 'Amigo del Bosque',
      description: 'En armonía con la naturaleza',
      image: '/images/stamp-13.png',
      eventId: 'event_1',
      categoryId: 'nature',
      rarity: 'common'
    },
    {
      id: 'guardian-del-rio',
      name: 'Guardián del Río',
      description: 'Protector de las aguas cristalinas',
      image: '/images/stamp-4.png',
      eventId: 'event_5',
      categoryId: 'nature',
      rarity: 'rare'
    },
    {
      id: 'protector-montana',
      name: 'Protector de la Montaña',
      description: 'Guardián de las altas cumbres',
      image: '/images/stamp-15.png',
      eventId: 'event_4',
      categoryId: 'nature',
      rarity: 'epic'
    },
    {
      id: 'espiritu-naturaleza',
      name: 'Espíritu de la Naturaleza',
      description: 'Uno con todos los elementos naturales',
      image: '/images/stamp-12.png',
      eventId: 'event_4',
      categoryId: 'nature',
      rarity: 'legendary'
    },
    // Temporadas
    {
      id: 'aventura-primaveral',
      name: 'Aventura Primaveral',
      description: 'Floreciendo con la nueva temporada',
      image: '/images/achievement-4.png',
      eventId: 'event_1',
      categoryId: 'seasons',
      rarity: 'common'
    },
    {
      id: 'explorador-verano',
      name: 'Explorador de Verano',
      description: 'Disfrutando del calor estival',
      image: '/images/stamp-3.png',
      eventId: 'event_5',
      categoryId: 'seasons',
      rarity: 'rare'
    },
    // Sellos de hitos de kilómetros específicos
    {
      id: 'medalla-150km',
      name: 'Medalla 150 km',
      description: 'Has superado los 150 kilómetros',
      image: '/images/stamp-5.png',
      eventId: 'event_4',
      categoryId: 'kilometers',
      rarity: 'rare'
    },
    {
      id: 'conquistador-200km',
      name: 'Conquistador 200 km',
      description: 'Doscientos kilómetros de pura aventura',
      image: '/images/achievement-2.png',
      eventId: 'event_2',
      categoryId: 'kilometers',
      rarity: 'epic'
    },
    {
      id: 'titán-300km',
      name: 'Titán de 300 km',
      description: 'Un logro verdaderamente titánico',
      image: '/images/achievement-3.png',
      eventId: 'event_4',
      categoryId: 'kilometers',
      rarity: 'epic'
    },
    {
      id: 'leyenda-500km',
      name: 'Leyenda 500 km',
      description: 'Quinientos kilómetros de leyenda pura',
      image: '/images/stamp-7.png',
      eventId: 'event_2',
      categoryId: 'kilometers',
      rarity: 'legendary'
    },
    {
      id: 'maestro-750km',
      name: 'Maestro 750 km',
      description: 'Solo los verdaderos maestros llegan aquí',
      image: '/images/stamp-12.png',
      eventId: 'event_4',
      categoryId: 'kilometers',
      rarity: 'legendary'
    },
    {
      id: 'ascension-1000km',
      name: 'Ascensión 1000 km',
      description: '¡Mil kilómetros! Has alcanzado la ascensión',
      image: '/images/stamp-15.png',
      eventId: 'event_2',
      categoryId: 'special',
      rarity: 'legendary'
    }
  ];

  for (const stampData of stamps) {
    await prisma.stamp.upsert({
      where: { id: stampData.id },
      update: {},
      create: stampData
    });
  }

  // Crear logros del sistema
  const achievements = [
    {
      id: 'achievement_1',
      name: 'Primeros Pasos',
      description: 'Completa tu primer evento del Camino Guau',
      icon: '/images/welcome-medal.png',
      type: 'events',
      threshold: 1,
      order: 1
    },
    {
      id: 'achievement_2',
      name: 'Caminante Bronce',
      description: 'Recorre 25 kilómetros en total',
      icon: '/images/welcome-medal.png',
      type: 'kilometers',
      threshold: 25,
      order: 2
    },
    {
      id: 'achievement_3',
      name: 'Caminante Plata',
      description: 'Recorre 50 kilómetros en total',
      icon: '/images/stamp-10.png',
      type: 'kilometers',
      threshold: 50,
      order: 3
    },
    {
      id: 'achievement_4',
      name: 'Caminante Oro',
      description: 'Completa la meta de 100 kilómetros del Camino Guau',
      icon: '/images/stamp-14.png',
      type: 'kilometers',
      threshold: 100,
      order: 4
    },
    {
      id: 'achievement_5',
      name: 'Coleccionista',
      description: 'Colecciona 5 sellos digitales',
      icon: '/images/stamp-11.png',
      type: 'stamps',
      threshold: 5,
      order: 5
    },
    {
      id: 'achievement_6',
      name: 'Peregrino Experto',
      description: 'Participa en 10 eventos del Camino Guau',
      icon: '/images/achievement-6.png',
      type: 'events',
      threshold: 10,
      order: 6
    },
    {
      id: 'achievement_7',
      name: 'Explorador Avanzado',
      description: 'Alcanza los 150 kilómetros en tu viaje',
      icon: '/images/stamp-5.png',
      type: 'kilometers',
      threshold: 150,
      order: 7
    },
    {
      id: 'achievement_8',
      name: 'Conquistador de Rutas',
      description: 'Supera la barrera de los 200 kilómetros',
      icon: '/images/achievement-2.png',
      type: 'kilometers',
      threshold: 200,
      order: 8
    },
    {
      id: 'achievement_9',
      name: 'Titán del Camino',
      description: 'Recorre 300 kilómetros de aventura pura',
      icon: '/images/achievement-3.png',
      type: 'kilometers',
      threshold: 300,
      order: 9
    },
    {
      id: 'achievement_10',
      name: 'Leyenda Viviente',
      description: '500 kilómetros te convierten en leyenda',
      icon: '/images/stamp-7.png',
      type: 'kilometers',
      threshold: 500,
      order: 10
    },
    {
      id: 'achievement_11',
      name: 'Maestro del Universo',
      description: 'Has recorrido 750 kilómetros, eres un maestro',
      icon: '/images/stamp-12.png',
      type: 'kilometers',
      threshold: 750,
      order: 11
    },
    {
      id: 'achievement_12',
      name: 'Ascensión Divina',
      description: '¡1000 kilómetros! Has alcanzado la ascensión divina',
      icon: '/images/stamp-15.png',
      type: 'kilometers',
      threshold: 1000,
      order: 12
    }
  ];

  for (const achievementData of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievementData.id },
      update: {},
      create: achievementData
    });
  }

  // Dar algunos logros al usuario de prueba
  await prisma.userAchievement.upsert({
    where: { 
      userId_achievementId: {
        userId: testUser.id,
        achievementId: 'achievement_1'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      achievementId: 'achievement_1'
    }
  });

  await prisma.userAchievement.upsert({
    where: { 
      userId_achievementId: {
        userId: testUser.id,
        achievementId: 'achievement_2'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      achievementId: 'achievement_2'
    }
  });

  // Dar algunos sellos al usuario de prueba
  await prisma.userStamp.upsert({
    where: {
      userId_stampId: {
        userId: testUser.id,
        stampId: 'explorador-novato'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      stampId: 'explorador-novato'
    }
  });

  await prisma.userStamp.upsert({
    where: {
      userId_stampId: {
        userId: testUser.id,
        stampId: 'primeros-pasos'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      stampId: 'primeros-pasos'
    }
  });

  // Crear algunas asistencias para el usuario de prueba
  await prisma.attendance.upsert({
    where: {
      userId_eventId: {
        userId: testUser.id,
        eventId: 'event_1'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      eventId: 'event_1',
      attended: true,
      qrScanned: true
    }
  });

  await prisma.attendance.upsert({
    where: {
      userId_eventId: {
        userId: testUser.id,
        eventId: 'event_2'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      eventId: 'event_2',
      attended: true,
      qrScanned: true
    }
  });

  console.log('✅ Seed completado exitosamente!');
  console.log(`📧 Usuario de prueba creado: john@doe.com / johndoe123`);
  console.log(`🐕 Perro de prueba: Buddy (Golden Retriever)`);
  console.log(`📅 ${events.length} eventos creados`);
  console.log(`🏆 ${achievements.length} logros creados`);
  console.log(`📜 ${stamps.length} sellos digitales creados`);
  console.log(`🎯 ${stampCategories.length} categorías de sellos creadas`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
