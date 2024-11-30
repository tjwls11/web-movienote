import NextAuth from 'next-auth'
import github from 'next-auth/providers/github'
import google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [google, github],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      const apiUrl = process.env.API_URL
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const res = await fetch(`${apiUrl}/api/user-auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, account }),
          })
          if (res.ok) {
            return true
          }
          return false
        } catch (error) {
          console.log(error)
          return false
        }
      }
      return true
    },
  },
})
