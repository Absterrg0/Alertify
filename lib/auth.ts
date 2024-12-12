import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/db";
import { v4 } from "uuid";
import { User } from "next-auth";

declare module "next-auth" {
  interface User{
    id?:string,
    email?:string | null
    name?:string | null
    apiKey?:string

  }
}

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
        token.apiKey = user.apiKey;
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
        session.user.apiKey = token.apiKey as string;
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
        const apiKey = `dl_${v4()}`
        await prisma.user.create({
          data: {
            name: user.name,
            apiKey
          }
        })
        return `${process.env.NEXTAUTH_URL}/onboarding`;
      }
      return false;
    },
  },
});