import Image from "next/image";
import { AuthForm } from "../components/ui/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/abstract-pattern.svg"
          alt="Abstract background pattern"
          fill
          className="opacity-10 object-cover"
        />
      </div>

      {/* Two-column layout */}
      <div className="z-10 w-full flex flex-col md:flex-row items-stretch">
        {/* Left column: Auth Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm relative">
          <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                <span className="text-zinc-100">Welcome to</span>
                <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent"> Droplert</span> 
              </h2>
              <p className="text-lg text-zinc-300 tracking-tight">
                Sign in to explore the unknown
              </p>
            </div>
            <AuthForm />
          </div>
        </div>

        {/* Right column: Project Description */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-zinc-800/50 via-zinc-800/40 to-zinc-900/50 backdrop-blur-sm border-l border-zinc-600/30 relative">
          <div className="max-w-lg relative z-10">
            {/* Metallic accent line at top */}
            <div className="w-24 h-0.5 mx-auto mb-8 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
            
            <div className="space-y-8">
              {/* First line - largest and most impactful */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-zinc-100 to-zinc-200 bg-clip-text text-transparent">
                    DROPLERT
                  </span>
                </h2>
              </div>

              {/* Second line - medium emphasis */}
              <div className="text-center relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-sky-400/10 to-blue-500/10 animate-pulse" />
                <p className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent">
                  Empower Your Website with Real-Time Alerts
                </p>
              </div>

              {/* Third line - enhanced elegant design */}
              <div className="text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/5 to-transparent" />
                <div className="relative">
 
                  <p className="text-xl md:text-2xl font-medium">
                    <span className="bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 bg-clip-text text-transparent">
                      Notify your users instantly with a simple command
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Metallic accent line at bottom */}
            <div className="w-24 h-0.5 mx-auto mt-8 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
          </div>

          {/* Background decorative elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-sky-400/20 to-transparent" />
          <div className="absolute left-0 top-1/4 w-1 h-16 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
        </div>
      </div>

      {/* Additional animated elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-sky-400/30 rounded-full animate-spin-slow" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-blue-400/30 rounded-lg animate-float" />
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-sky-300/30 to-blue-400/30 rounded-lg animate-pulse" />
      
      {/* Particle effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sky-400/50 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}