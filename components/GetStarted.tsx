import Image from "next/image";
import { AuthForm } from "./ui/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/abstract-pattern.svg"
          alt="Futuristic background"
          fill
          className="opacity-30 object-cover"
          priority
        />
      </div>



      {/* Card Container */}
      <div className="z-10 w-full max-w-md p-8 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent  tracking-tight mb-4">
            <div className="text-zinc-200">
            Welcome to
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text"> DropAlert</span> 
          </h2>
          <p className="text-lg text-gray-300 tracking-tight">
            Sign in to explore the unknown
          </p>
        </div>
        <AuthForm />
      </div>

      {/* Abstract shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 border-4 border-cyan-500 rounded-full opacity-20 animate-spin-slow" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-purple-500 rounded-lg opacity-20 animate-bounce" />
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg opacity-20 animate-pulse" />
    </div>
  );
}

