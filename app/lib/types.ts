
import type { User as PrismaUser, Role, Walk as PrismaWalk, Achievement as PrismaAchievement, UserAchievement as PrismaUserAchievement, AchievementCategory } from "@prisma/client"

export interface User extends PrismaUser {
  role: Role
}

export interface Walk extends PrismaWalk {
  user: User
}

export interface Achievement extends PrismaAchievement {
  category: AchievementCategory
  users: UserAchievement[]
}

export interface UserAchievement extends PrismaUserAchievement {
  user: User
  achievement: Achievement
}

export interface DashboardStats {
  totalWalks: number
  totalKilometers: number
  currentStreak: number
  bestStreak: number
  recentWalks: Walk[]
  unlockedAchievements: number
  totalAchievements: number
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: Role
    }
  }
  
  interface User {
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
  }
}
