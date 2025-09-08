
// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }

  interface User {
    id: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}

// Achievement types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  kmRequired: number | null
  walksRequired: number | null
  streakRequired: number | null
  isActive: boolean
  sortOrder: number
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
  progress: number
  achievement: Achievement
}

// Dog types
export interface Dog {
  id: string
  userId: string
  name: string
  breed?: string | null
  sex?: 'MALE' | 'FEMALE' | 'UNKNOWN' | null
  age?: number | null
  photo?: string | null
  obedience?: number | null
  socializationWithDogs?: number | null
  socializationWithPeople?: number | null
  specialCharacteristic?: string | null
  isActive: boolean
  createdAt: Date
}

// Walk types  
export interface Walk {
  id: string
  userId: string
  kilometers: number
  duration?: number | null
  date: Date
  notes?: string | null
  weather?: string | null
  dogMood?: string | null
  dogCondition?: string | null
  userFeedback?: string | null
  rating?: number | null
  eventRouteId?: string | null
}

// User types
export interface User {
  id: string
  name?: string | null
  email: string
  role: 'USER' | 'ADMIN'
  totalKilometers: number
  totalWalks: number
  currentStreak: number
  bestStreak: number
  lastWalkDate?: Date | null
  joinedDate: Date
}

// Admin stats types
export interface MonthlyWalkData {
  month: string
  walks: number
  totalKm: number
  avgDuration: number
}

export interface MonthlyUserData {
  month: string
  newUsers: number
  activeUsers: number
  totalUsers: number
}

export interface DashboardStats {
  totalUsers: number
  totalWalks: number
  totalKilometers: number
  totalAchievements: number
  monthlyWalks: MonthlyWalkData[]
  monthlyUsers: MonthlyUserData[]
}
