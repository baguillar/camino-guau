

import type { User as PrismaUser, Role, Walk as PrismaWalk, Achievement as PrismaAchievement, UserAchievement as PrismaUserAchievement, AchievementCategory, Dog as PrismaDog, DogSex } from "@prisma/client"

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

export interface Dog extends PrismaDog {
  sex: DogSex
  user: User
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

// Types for admin stats with proper typing for SQL queries
export interface MonthlyWalkData {
  month: Date
  walks: number
  kilometers: number
}

export interface MonthlyUserData {
  month: Date
  users: number
}

export interface StatsData {
  basicStats: {
    totalUsers: number
    totalWalks: number
    totalKilometers: number
    totalAchievements: number
    totalEventRoutes: number
    totalEventParticipants: number
  }
  recentActivity: {
    recentUsers: number
    recentWalks: number
    recentEventParticipants: number
    activeUsers7Days: number
    activeUsers30Days: number
  }
  topUsers: {
    byKilometers: Array<{
      id: string
      name: string | null
      email: string
      totalKilometers: number
      totalWalks: number
    }>
    byWalks: Array<{
      id: string
      name: string | null
      email: string
      totalKilometers: number
      totalWalks: number
    }>
  }
  chartData: {
    monthlyWalks: MonthlyWalkData[]
    monthlyUsers: MonthlyUserData[]
  }
  achievementStats: Array<{
    id: string
    name: string
    description: string
    icon: string
    category: string
    _count: {
      users: number
    }
  }>
  eventRouteStats: Array<{
    id: string
    name: string
    location: string
    distance: number
    difficulty: string
    eventDate: Date
    _count: {
      eventParticipants: number
      walks: number
    }
  }>
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
