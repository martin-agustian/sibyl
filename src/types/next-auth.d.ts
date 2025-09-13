import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
			name: string
      email: string
      role: string
      emailVerif: boolean
      accountVerif: boolean
    }
  }
  interface User {
    id: string
    email: string
    role: string
    emailVerif: boolean
    accountVerif: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    emailVerif: boolean
    akunVerif: boolean
  }
}
