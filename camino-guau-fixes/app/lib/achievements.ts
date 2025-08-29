
import { prisma } from '@/lib/db'
import { AchievementCategory } from '@prisma/client'

export async function checkAndGrantAchievements(userId: string) {
  try {
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })

    if (!user) return

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany({
      where: { isActive: true }
    })

    const userAchievementIds = user.achievements.map(ua => ua.achievementId)
    const newAchievements = []

    for (const achievement of allAchievements) {
      // Skip if user already has this achievement
      if (userAchievementIds.includes(achievement.id)) continue

      let shouldGrant = false

      // Check achievement criteria
      switch (achievement.category) {
        case AchievementCategory.WALKS:
          if (achievement.walksRequired && user.totalWalks >= achievement.walksRequired) {
            shouldGrant = true
          }
          break

        case AchievementCategory.DISTANCE:
          if (achievement.kmRequired && user.totalKilometers >= achievement.kmRequired) {
            shouldGrant = true
          }
          break

        case AchievementCategory.STREAK:
          if (achievement.streakRequired && user.currentStreak >= achievement.streakRequired) {
            shouldGrant = true
          }
          break

        case AchievementCategory.SPECIAL:
          // Special achievements like welcome are granted manually or on specific events
          if (achievement.name === 'Bienvenida') {
            shouldGrant = true
          }
          break

        case AchievementCategory.EVENTROUTE:
          // Check event route participation
          const eventRouteParticipations = await prisma.eventParticipant.count({
            where: { 
              userId,
              attendanceConfirmed: true
            }
          })
          
          if (achievement.name === 'Participante EventosGuau' && eventRouteParticipations >= 1) {
            shouldGrant = true
          } else if (achievement.name === 'Explorador de Rutas' && eventRouteParticipations >= 5) {
            shouldGrant = true
          } else if (achievement.name === 'Maestro de EventosGuau' && eventRouteParticipations >= 10) {
            shouldGrant = true
          }
          break

        case AchievementCategory.CONSTANCY:
          // Check consecutive event participation
          const consecutiveParticipations = await getConsecutiveEventParticipations(userId)
          
          if (achievement.name === 'Chapa de Constancia - Bronce' && consecutiveParticipations >= 2) {
            shouldGrant = true
          } else if (achievement.name === 'Chapa de Constancia - Plata' && consecutiveParticipations >= 3) {
            shouldGrant = true
          } else if (achievement.name === 'Chapa de Constancia - Oro' && consecutiveParticipations >= 5) {
            shouldGrant = true
          }
          break
      }

      if (shouldGrant) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: 100
          }
        })
        newAchievements.push(achievement)
      }
    }

    return newAchievements
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}

async function getConsecutiveEventParticipations(userId: string): Promise<number> {
  try {
    const participations = await prisma.eventParticipant.findMany({
      where: {
        userId,
        attendanceConfirmed: true
      },
      include: {
        eventRoute: true
      },
      orderBy: {
        eventRoute: {
          eventDate: 'desc'
        }
      }
    })

    if (participations.length === 0) return 0

    let consecutive = 1
    let maxConsecutive = 1

    for (let i = 1; i < participations.length; i++) {
      const currentDate = new Date(participations[i].eventRoute.eventDate)
      const previousDate = new Date(participations[i - 1].eventRoute.eventDate)
      
      // Check if events are consecutive (within reasonable time frame)
      const daysDifference = Math.abs((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDifference <= 30) { // Consider events within 30 days as consecutive
        consecutive++
        maxConsecutive = Math.max(maxConsecutive, consecutive)
      } else {
        consecutive = 1
      }
    }

    return maxConsecutive
  } catch (error) {
    console.error('Error calculating consecutive participations:', error)
    return 0
  }
}

export async function grantWelcomeAchievement(userId: string) {
  try {
    const welcomeAchievement = await prisma.achievement.findUnique({
      where: { name: 'Bienvenida' }
    })

    if (!welcomeAchievement) return

    // Check if user already has welcome achievement
    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: welcomeAchievement.id
        }
      }
    })

    if (!existingAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: welcomeAchievement.id,
          progress: 100
        }
      })
      return welcomeAchievement
    }

    return null
  } catch (error) {
    console.error('Error granting welcome achievement:', error)
    return null
  }
}
