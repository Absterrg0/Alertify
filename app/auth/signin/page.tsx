'use client'

import { initiateSignIn } from "../actions"
import { useState } from "react"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await initiateSignIn(provider)
    } catch (error) {
      console.error('Sign-in failed:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Sign In</h1>
        <div className="space-y-4">
          <button
            onClick={() => handleSignIn("github")}
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
          >
            {isLoading ? 'Loading...' : 'Sign in with GitHub'}
          </button>
          <button
            onClick={() => handleSignIn("google")}
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            {isLoading ? 'Loading...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  )
}

