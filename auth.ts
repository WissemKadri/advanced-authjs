import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { getUserById } from './data/user'
import { db } from './lib/db'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'
import { getAccountByUserId } from './data/account'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      if (!user.emailVerified)
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
          },
        })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      if (!user.emailVerified) return false

      if (user.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id!
        )

        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        })
      }

      return true
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.name = token.name
        session.user.email = token.email!
        session.user.role = token.role
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
        session.user.isOAuth = token.isOAuth
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.isTwoFactorEnabled = user.isTwoFactorEnabled
      } else {
        if (!token.sub) return token

        const existingUser = await getUserById(token.sub)

        if (!existingUser) return token

        const existingAccount = await getAccountByUserId(existingUser.id)

        token.name = existingUser.name
        token.email = existingUser.email
        token.role = existingUser.role
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
        token.isOAuth = !!existingAccount
      }

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
