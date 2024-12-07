'use server'

import { signIn } from "@/lib/auth"

export async function initiateSignIn(provider: string) {
  try {
    await signIn(provider, { callbackUrl: '/dashboard' })
  } catch (error) {
    // Handle or log error
    console.error('Sign-in error:', error)
    throw error
  }
}

