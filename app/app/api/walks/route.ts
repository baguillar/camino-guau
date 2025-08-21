
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { kilometers, duration, notes, weather, dogMood, eventRouteId, dogCondition, userFeedback, rating } = await req.json()

    if (!kilometers || kilometers <= 0) {
      return NextResponse.json({ error: 'Distance is required and must be positive' }, { status: 400 })
    }

    if (kilometers > 50) {
      return NextResponse.json({ error: 'Distance cannot exceed 50 km' }, { status: 400 })
    }

    // Create the walk
    const walk = await prisma.walk.create({
      data: {
        userId: session.user.id,
        kilometers: parseFloat(kilometers),
        duration: duration ? parseInt(duration) : null,
        notes: notes || null,
        weather: weather || null,
        dogMood: dogMood || null,
        eventRouteId: eventRouteId || null,
        dogCondition: dogCondition || null,
        userFeedback: userFeedback || null,
        rating: rating ? parseInt(rating) : null,
      },
    })

    // Update user statistics
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate new streak
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let newStreak = 1
    if (user.lastWalkDate) {
      const lastWalkDate = new Date(user.lastWalkDate)
      const diffInDays = Math.floor((today.getTime() - lastWalkDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffInDays === 0) {
        // Same day walk
        newStreak = user.currentStreak
      } else if (diffInDays === 1) {
        // Consecutive day
        newStreak = user.currentStreak + 1
      } else {
        // Streak broken
        newStreak = 1
      }
    }

    const newTotalKm = user.totalKilometers + parseFloat(kilometers)
    const newTotalWalks = user.totalWalks + 1
    const newBestStreak = Math.max(user.bestStreak, newStreak)

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalKilometers: newTotalKm,
        totalWalks: newTotalWalks,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        lastWalkDate: today,
      },
    })

    // Check for new achievements
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
    })

    const newAchievements = []

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const existingAchievement = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId: session.user.id,
            achievementId: achievement.id,
          },
        },
      })

      if (!existingAchievement) {
        let shouldUnlock = false

        // Standard achievements
        if (achievement.kmRequired && newTotalKm >= achievement.kmRequired) {
          shouldUnlock = true
        }
        if (achievement.walksRequired && newTotalWalks >= achievement.walksRequired) {
          shouldUnlock = true
        }
        if (achievement.streakRequired && newStreak >= achievement.streakRequired) {
          shouldUnlock = true
        }

        // EventosGuau route achievements
        if (achievement.category === 'EVENTROUTE') {
          if (achievement.name === 'Participante EventosGuau' && eventRouteId) {
            shouldUnlock = true
          } else if (achievement.name === 'Explorador de Rutas') {
            // Check if user has completed 5 different routes
            const uniqueRoutes = await prisma.walk.findMany({
              where: { 
                userId: session.user.id,
                eventRouteId: { not: null }
              },
              distinct: ['eventRouteId']
            })
            if (uniqueRoutes.length >= 5) shouldUnlock = true
          } else if (achievement.name === 'Maestro de EventosGuau') {
            // Check if user has completed 10 different routes
            const uniqueRoutes = await prisma.walk.findMany({
              where: { 
                userId: session.user.id,
                eventRouteId: { not: null }
              },
              distinct: ['eventRouteId']
            })
            if (uniqueRoutes.length >= 10) shouldUnlock = true
          }
        }

        // Constancy achievements (chapas de constancia)
        if (achievement.category === 'CONSTANCY' && eventRouteId) {
          const recentRouteWalks = await prisma.walk.findMany({
            where: {
              userId: session.user.id,
              eventRouteId: { not: null },
              date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
            },
            orderBy: { date: 'desc' },
            take: 10
          })

          // Check for consecutive participation
          let consecutiveCount = 0
          const routeDates = recentRouteWalks.map(w => new Date(w.date).toDateString())
          const uniqueDates = [...new Set(routeDates)]

          if (uniqueDates.length >= 2) {
            consecutiveCount = 2
            if (achievement.name === 'Chapa de Constancia - Bronce') shouldUnlock = true
          }
          if (uniqueDates.length >= 3) {
            consecutiveCount = 3
            if (achievement.name === 'Chapa de Constancia - Plata') shouldUnlock = true
          }
          if (uniqueDates.length >= 5) {
            consecutiveCount = 5
            if (achievement.name === 'Chapa de Constancia - Oro') shouldUnlock = true
          }
        }

        if (shouldUnlock) {
          await prisma.userAchievement.create({
            data: {
              userId: session.user.id,
              achievementId: achievement.id,
              progress: 100,
            },
          })
          newAchievements.push(achievement)
        }
      }
    }

    return NextResponse.json({ 
      walk, 
      newAchievements: newAchievements 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating walk:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
