
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { kilometers, duration, date, notes, weather, dogMood, dogCondition, rating } = data

    if (!kilometers || kilometers <= 0) {
      return NextResponse.json({ error: 'Los kilómetros son requeridos y deben ser mayor a 0' }, { status: 400 })
    }

    // Create the walk
    const walk = await prisma.walk.create({
      data: {
        userId: session.user.id,
        kilometers: parseFloat(kilometers),
        duration: duration ? parseInt(duration) : null,
        date: new Date(date),
        notes: notes || null,
        weather: weather || null,
        dogMood: dogMood || null,
        dogCondition: dogCondition || null,
        rating: rating ? parseInt(rating) : null
      }
    })

    // Update user statistics
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user) {
      const newTotalKm = user.totalKilometers + parseFloat(kilometers)
      const newTotalWalks = user.totalWalks + 1
      
      // Calculate streak
      const today = new Date()
      const walkDate = new Date(date)
      const lastWalkDate = user.lastWalkDate ? new Date(user.lastWalkDate) : null
      
      let newStreak = user.currentStreak
      
      if (lastWalkDate) {
        const daysDiff = Math.floor((walkDate.getTime() - lastWalkDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          // Consecutive day
          newStreak = user.currentStreak + 1
        } else if (daysDiff === 0) {
          // Same day, keep streak
          newStreak = user.currentStreak
        } else {
          // Streak broken
          newStreak = 1
        }
      } else {
        // First walk
        newStreak = 1
      }

      const newBestStreak = Math.max(user.bestStreak, newStreak)

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalKilometers: newTotalKm,
          totalWalks: newTotalWalks,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          lastWalkDate: walkDate
        }
      })

      // Check and unlock achievements
      await checkAndUnlockAchievements(session.user.id, newTotalKm, newTotalWalks, newBestStreak)
    }

    revalidatePath('/dashboard')
    revalidatePath('/walks')
    revalidatePath('/achievements')

    return NextResponse.json(walk, { status: 201 })
  } catch (error) {
    console.error('Error creating walk:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

async function checkAndUnlockAchievements(userId: string, totalKm: number, totalWalks: number, bestStreak: number) {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true }
    })

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    })

    const unlockedAchievementIds = userAchievements.map(ua => ua.achievementId)

    for (const achievement of achievements) {
      if (unlockedAchievementIds.includes(achievement.id)) continue

      let shouldUnlock = false

      // Check distance achievements
      if (achievement.kmRequired && totalKm >= achievement.kmRequired) {
        shouldUnlock = true
      }

      // Check walks achievements
      if (achievement.walksRequired && totalWalks >= achievement.walksRequired) {
        shouldUnlock = true
      }

      // Check streak achievements
      if (achievement.streakRequired && bestStreak >= achievement.streakRequired) {
        shouldUnlock = true
      }

      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: 100
          }
        })
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const walks = await prisma.walk.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      include: {
        eventRoute: {
          select: {
            name: true,
            location: true
          }
        }
      }
    })

    return NextResponse.json(walks)
  } catch (error) {
    console.error('Error fetching walks:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
