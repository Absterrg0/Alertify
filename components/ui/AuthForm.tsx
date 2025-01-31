'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { motion } from 'framer-motion'

const AnimatedButton = ({ children, onClick, variant }:any) => {
  const isGoogle = variant === 'google'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button 
        variant="outline" 
        className={`w-full relative group h-14 px-6 rounded-xl border shadow-lg transition-all duration-500
          ${isGoogle ? 
            'bg-gradient-to-r from-metal-900/90 to-metal-800/90 border-metal-700/30 hover:border-metal-600/50' : 
            'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400/30 hover:border-indigo-400/50'
          }`}
        onClick={onClick}
      >
        {/* Ambient light effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${isGoogle ? 
            'bg-gradient-to-r from-metal-800/50 via-metal-700/50 to-metal-800/50' : 
            'bg-gradient-to-r from-indigo-500/50 via-indigo-400/50 to-indigo-500/50'
          }`}
        />
        
        {/* Content */}
        <span className="relative flex items-center justify-center">
          {isGoogle ? (
            <div className="absolute left-1 p-2 rounded-lg">
              <FcGoogle className="h-5 w-5" />
            </div>
          ) : (
            <div className="absolute left-1 p-2">
              <FaGithub className="h-5 w-5 text-white" />
            </div>
          )}
          <span className={`ml-8 font-semibold text-base
            ${isGoogle ? 
              'bg-gradient-to-r from-metal-100 to-metal-300 bg-clip-text text-transparent' : 
              'text-white'
            }`}>
            Continue with {isGoogle ? 'Google' : 'GitHub'}
          </span>
        </span>

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl
          ${isGoogle ? 'bg-metal-500/5' : 'bg-indigo-500/10'}`} 
        />
      </Button>
    </motion.div>
  )
}

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] animate-pulse-slow" />
      
      {/* Moving particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-indigo-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
        ))}
      </div>
      
      {/* Floating orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: 15 + Math.random() * 15,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div className="w-full h-full rounded-full bg-indigo-500/5 blur-3xl" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function AuthForm() {
  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/dashboard' })
  const handleGithubSignIn = () => signIn('github', { callbackUrl: '/dashboard' })

  return (
    <div className="relative space-y-6 z-10">
      <BackgroundAnimation />
      
      {/* Buttons */}
      <AnimatedButton variant="google" onClick={handleGoogleSignIn} />
      <AnimatedButton variant="github" onClick={handleGithubSignIn} />

      {/* Divider */}
      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-metal-800/30"></div>
        </div>
      </div>

      {/* Terms and Privacy */}
      <p className="text-center text-sm text-metal-400 mt-6">
        By signing in, you agree to our{' '}
        <a 
          href="#" 
          className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors relative group"
        >
          Terms of Service
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-indigo-400/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></span>
        </a>
        {' '}and{' '}
        <a 
          href="#" 
          className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors relative group"
        >
          Privacy Policy
          <span className="absolute -bottom-0.5 left-0 w-full h-px bg-indigo-400/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></span>
        </a>
      </p>
    </div>
  )
}