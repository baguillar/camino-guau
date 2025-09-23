
import { PrismaClient, AchievementType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create achievements (30 predefined medals)
  const achievements = [
    // 1. Primer evento
    {
      name: 'Primer Paso',
      description: 'Participa en tu primera ruta',
      type: AchievementType.EVENTS_TOTAL,
      condition: JSON.stringify({ events: 1 }),
      medalIcon: '🐾',
    },
    
    // 2-6. Eventos totales (10, 20, 30, 40, 50)
    {
      name: 'Caminante Novato',
      description: 'Participa en 10 eventos',
      type: AchievementType.EVENTS_TOTAL,
      condition: JSON.stringify({ events: 10 }),
      medalIcon: '🥉',
    },
    {
      name: 'Caminante Experimentado',
      description: 'Participa en 20 eventos',
      type: AchievementType.EVENTS_TOTAL,
      condition: JSON.stringify({ events: 20 }),
      medalIcon: '🥈',
    },
    {
      name: 'Caminante Veterano',
      description: 'Participa en 30 eventos',
      type: AchievementType.EVENTS_TOTAL,
      condition: JSON.stringify({ events: 30 }),
      medalIcon: '🥇',
    },
    {
      name: 'Explorador Experto',
      description: 'Participa en 40 eventos',
      type: AchievementType.EVENTS_TOTAL,
      condition: JSON.stringify({ events: 40 }),
      medalIcon: '🏆',
    },
    {
      name: 'Maestro Caminante',
      description: 'Participa en 50 eventos',
      type: AchievementType.EVENTS_TOTAL,
      condition: JSON.stringify({ events: 50 }),
      medalIcon: '👑',
    },

    // 7-15. Kilómetros totales (10, 25, 50, 75, 100, 150, 200, 250, 300)
    {
      name: 'Primeros 10K',
      description: 'Camina 10 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 10 }),
      medalIcon: '🏃‍♂️',
    },
    {
      name: 'Cuarto de Siglo',
      description: 'Camina 25 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 25 }),
      medalIcon: '🚶‍♂️',
    },
    {
      name: 'Medio Centenar',
      description: 'Camina 50 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 50 }),
      medalIcon: '⭐',
    },
    {
      name: 'Tres Cuartos',
      description: 'Camina 75 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 75 }),
      medalIcon: '💪',
    },
    {
      name: 'Centenario',
      description: 'Camina 100 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 100 }),
      medalIcon: '💯',
    },
    {
      name: 'Sesquicentenario',
      description: 'Camina 150 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 150 }),
      medalIcon: '🌟',
    },
    {
      name: 'Doble Centenario',
      description: 'Camina 200 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 200 }),
      medalIcon: '🔥',
    },
    {
      name: 'Cuarto de Milenio',
      description: 'Camina 250 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 250 }),
      medalIcon: '⚡',
    },
    {
      name: 'Trescientos Gloriosos',
      description: 'Camina 300 kilómetros en total',
      type: AchievementType.KILOMETERS_TOTAL,
      condition: JSON.stringify({ kilometers: 300 }),
      medalIcon: '🎖️',
    },

    // 16-18. Eventos consecutivos (5, 10, 15)
    {
      name: 'Racha de 5',
      description: 'Participa en 5 eventos consecutivos',
      type: AchievementType.EVENTS_CONSECUTIVE,
      condition: JSON.stringify({ consecutive: 5 }),
      medalIcon: '📈',
    },
    {
      name: 'Racha de 10',
      description: 'Participa en 10 eventos consecutivos',
      type: AchievementType.EVENTS_CONSECUTIVE,
      condition: JSON.stringify({ consecutive: 10 }),
      medalIcon: '🔥',
    },
    {
      name: 'Racha de 15',
      description: 'Participa en 15 eventos consecutivos',
      type: AchievementType.EVENTS_CONSECUTIVE,
      condition: JSON.stringify({ consecutive: 15 }),
      medalIcon: '💪',
    },

    // 19-30. Completar todos los eventos de cada mes (enero-diciembre)
    {
      name: 'Enero Completo',
      description: 'Participa en todos los eventos de enero',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 1 }),
      medalIcon: '❄️',
    },
    {
      name: 'Febrero Completo',
      description: 'Participa en todos los eventos de febrero',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 2 }),
      medalIcon: '💝',
    },
    {
      name: 'Marzo Completo',
      description: 'Participa en todos los eventos de marzo',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 3 }),
      medalIcon: '🌸',
    },
    {
      name: 'Abril Completo',
      description: 'Participa en todos los eventos de abril',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 4 }),
      medalIcon: '🌻',
    },
    {
      name: 'Mayo Completo',
      description: 'Participa en todos los eventos de mayo',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 5 }),
      medalIcon: '🌺',
    },
    {
      name: 'Junio Completo',
      description: 'Participa en todos los eventos de junio',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 6 }),
      medalIcon: '☀️',
    },
    {
      name: 'Julio Completo',
      description: 'Participa en todos los eventos de julio',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 7 }),
      medalIcon: '🏖️',
    },
    {
      name: 'Agosto Completo',
      description: 'Participa en todos los eventos de agosto',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 8 }),
      medalIcon: '🌞',
    },
    {
      name: 'Septiembre Completo',
      description: 'Participa en todos los eventos de septiembre',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 9 }),
      medalIcon: '🍂',
    },
    {
      name: 'Octubre Completo',
      description: 'Participa en todos los eventos de octubre',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 10 }),
      medalIcon: '🎃',
    },
    {
      name: 'Noviembre Completo',
      description: 'Participa en todos los eventos de noviembre',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 11 }),
      medalIcon: '🦃',
    },
    {
      name: 'Diciembre Completo',
      description: 'Participa en todos los eventos de diciembre',
      type: AchievementType.MONTHLY_COMPLETE,
      condition: JSON.stringify({ month: 12 }),
      medalIcon: '🎄',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  console.log('✅ Created 30 achievements');

  // Create test dog for admin user
  await prisma.dog.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      name: 'Rex',
      age: 5,
      breed: 'Golden Retriever',
      characterWithPeople: 'Muy amigable y cariñoso',
      characterWithDogs: 'Social y juguetón',
      isCastrated: true,
    },
  });

  console.log('✅ Created test dog for admin user');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
