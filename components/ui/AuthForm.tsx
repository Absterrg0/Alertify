'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export function AuthForm() {
  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/dashboard' })
  const handleGithubSignIn = () => signIn('github', { callbackUrl: '/dashboard' })

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-4 px-4 rounded-xl border border-gray-700 shadow-lg transition duration-300 ease-in-out transform hover:shadow-cyan-500/20"
        onClick={handleGoogleSignIn}
      >
        <FcGoogle className="mr-3 h-6 w-6" />
        <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
          Continue with Google
        </span>
      </Button>
      <Button 
        variant="default"
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-4 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:shadow-blue-500/20"
        onClick={handleGithubSignIn}
      >
        <FaGithub className="mr-3 h-6 w-6" />
        Continue with GitHub
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">Or</span>
        </div>
      </div>
      <p className="text-center text-sm text-gray-400 mt-8">
        By signing in, you agree to our{' '}
        <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
      </p>
    </div>
  )
}

