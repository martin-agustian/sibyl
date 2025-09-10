import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

const handler = NextAuth({
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
					email: user.email,
					role: user.role,
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
				token.emailVerif = user.emailVerif;
				token.accountVerif = user.accountVerif;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
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
});

export { handler as GET, handler as POST };
