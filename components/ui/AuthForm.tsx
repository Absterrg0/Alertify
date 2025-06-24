"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { motion } from "framer-motion"

interface AuthButtonProps {
  variant: "google" | "github"
  onClick: () => void
}

const AuthButton = ({ onClick, variant }: AuthButtonProps) => {
  const isGoogle = variant === "google"

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
      <div className="relative group">
        {/* Glass effect background */}
        <div className={`absolute inset-0 rounded-xl backdrop-blur-md border transition-all duration-300 ${
          isGoogle
            ? "bg-white/10 border-white/20 group-hover:bg-white/15 group-hover:border-white/30"
            : "bg-zinc-800/30 border-zinc-700/50 group-hover:bg-zinc-700/40 group-hover:border-zinc-600/60"
        }`} />
        
        <Button
          variant="ghost"
          className={`w-full relative flex items-center justify-center h-14 px-6 rounded-xl border-0 bg-transparent transition-all duration-300 ${
            isGoogle
              ? "text-zinc-100 hover:text-white"
              : "text-zinc-100 hover:text-white"
          }`}
          onClick={onClick}
        >
          {isGoogle ? <FcGoogle className="h-5 w-5 mr-3" /> : <FaGithub className="h-5 w-5 mr-3" />}
          <span className="font-semibold text-base">Continue with {isGoogle ? "Google" : "GitHub"}</span>
        </Button>
      </div>
    </motion.div>
  )
}

export function AuthForm() {
  const handleGoogleSignIn = () => signIn("google", { callbackUrl: "/dashboard" })
  const handleGithubSignIn = () => signIn("github", { callbackUrl: "/dashboard" })

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-4">
        <AuthButton variant="google" onClick={handleGoogleSignIn} />
        <AuthButton variant="github" onClick={handleGithubSignIn} />
      </div>

      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 py-1 text-sm text-zinc-400 bg-zinc-950/50 backdrop-blur-sm rounded-full border border-white/10">
            Secure Authentication
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-zinc-400 leading-relaxed">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="font-medium text-sky-400 hover:text-sky-300 transition-colors duration-200 underline decoration-dotted underline-offset-4"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium text-sky-400 hover:text-sky-300 transition-colors duration-200 underline decoration-dotted underline-offset-4"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

