import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "@/db";
import { v4 } from "uuid";
import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    apiKey?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      apiKey: string;
    };
  }

  interface JWT {
    id?: string;
    email?: string;
    name?: string | null;
    apiKey?: string;
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
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        // For first time sign in
        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email || undefined,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.apiKey = dbUser.apiKey;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        session.user.apiKey = token.apiKey as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }
    
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
    
          if (existingUser) {
            // If user exists, ensure they have an API key
            if (!existingUser.apiKey) {
              await prisma.user.update({
                where: { email: user.email },
                data: { apiKey: `dl_${v4()}` },
              });
            }
    
            // Redirect to dashboard for existing users
            return `${process.env.NEXTAUTH_URL}/dashboard`;
          }
    
          // If user doesn't exist, create a new user
          const apiKey = `dl_${v4()}`;
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "New User",
              apiKey: apiKey,
            },
          });
    
          // Redirect to onboarding for new users
          return `${process.env.NEXTAUTH_URL}/onboarding`;
        }
    
        return false;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    }
  },

  session: {
    strategy: "jwt",
  },
});