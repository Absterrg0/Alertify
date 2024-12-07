import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user.name) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            name: user.name
          }
        });

        if (existingUser) {
          return `${process.env.NEXTAUTH_URL}/dashboard`;
        }
        await prisma.user.create({
          data:{
            name:user.name
          }
        })
        return `${process.env.NEXTAUTH_URL}/auth/onboarding`;
      }
      return false;
    },
  },
});