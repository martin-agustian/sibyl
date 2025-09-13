import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

import { NextAuthOptions } from "next-auth";
import { UserRoleEnum } from "@/commons/enum";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
		maxAge: 60 * 30,
  },
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) throw new Error("Email not found!");

				const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
				if (!isValid) throw new Error("Wrong password!");

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.email === process.env.ADMIN_EMAIL ? UserRoleEnum.ADMIN : user.role,
					jurisdiction: user.jurisdiction,
					barNumber: user.barNumber,
				};
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === "google") {
				const existingUser = await prisma.user.findUnique({ where: { email: user.email! } });
				if (!existingUser) {
					throw new Error(`No account found for ${user.email}. Please register first using this email before trying to sign in.`);
				}

				user.id = existingUser.id;
				user.role = existingUser.email === process.env.ADMIN_EMAIL ? "ADMIN" : existingUser.role;
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
