import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

import { NextAuthOptions } from "next-auth";
import { UserRoleEnum } from "@/commons/enum";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
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
					emailVerif: user.emailVerif,
					accountVerif: user.accountVerif,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.email = user.email;
				token.name = user.name;
				token.emailVerif = user.emailVerif;
				token.accountVerif = user.accountVerif;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
				session.user.emailVerif = token.emailVerif as boolean;
				session.user.accountVerif = token.accountVerif as boolean;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login", // custom login page
	},
	secret: process.env.NEXTAUTH_SECRET,
};
