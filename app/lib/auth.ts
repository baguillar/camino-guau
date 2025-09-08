
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  // No usar adapter con CredentialsProvider
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            throw new Error('Usuario no encontrado')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || ''
        session.user.role = token.role || 'USER'
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // Redirect errors back to login
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.id) {
        // Auto-grant welcome achievement for new users
        try {
          const welcomeAchievement = await prisma.achievement.findUnique({
            where: { name: 'Bienvenida' }
          })

          if (welcomeAchievement) {
            await prisma.userAchievement.create({
              data: {
                userId: user.id,
                achievementId: welcomeAchievement.id,
                progress: 100
              }
            })
          }
        } catch (error) {
          console.error('Error granting welcome achievement:', error)
        }
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
}

export function isAdmin(userRole: string | undefined): boolean {
  return userRole === 'ADMIN'
}

export function isUser(userRole: string | undefined): boolean {
  return userRole === 'USER' || userRole === 'ADMIN'
}
