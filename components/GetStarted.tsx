import Image from "next/image";
import { AuthForm } from "./ui/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/abstract-pattern.svg"
          alt="Smooth wave background"
          fill
          className="opacity-50 object-cover"
          priority
        />
      </div>

      {/* Glowing orb effects */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />

      {/* Card Container */}
      <div className="z-10 w-full max-w-md p-8 bg-gradient-to-b from-cyan-700/80 to-cyan-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-cyan-50 tracking-tight mb-4">
            Welcome!!
          </h2>
          <p className="text-lg text-cyan-100 tracking-tight">
            Sign in to explore more features!
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}