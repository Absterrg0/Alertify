'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export function AuthForm() {
  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/' })
  const handleGithubSignIn = () => signIn('github', { callbackUrl: '/' })

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="w-full bg-slate-100 text-gray-800 font-semibold py-4 px-4 rounded-xl border border-gray-300 shadow-md transition duration-300 ease-in-out transform hover:brightness-105 "
        onClick={handleGoogleSignIn}
      >
        <FcGoogle className="mr-3 h-6 w-6" />
        Continue with Google
      </Button>
      <Button 
        variant="default"
        className="w-full bg-gray-800 text-white font-semibold py-4 px-4 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:bg-black"
        onClick={handleGithubSignIn}
      >
        <FaGithub className="mr-3 h-6 w-6" />
        Continue with GitHub
      </Button>
      <p className="text-center text-sm text-blue-100 mt-8">
        By signing in, you agree to our{' '}
        <a href="#" className="text-orange-300 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-orange-300 hover:underline">Privacy Policy</a>
      </p>
    </div>
  )
}

