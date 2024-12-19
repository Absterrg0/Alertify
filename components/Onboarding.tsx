"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AnimatePresence, motion } from "framer-motion"
import { CopyIcon, CheckIcon, KeyIcon, RocketIcon, GlobeIcon, UserIcon, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog"
import { v4 } from 'uuid'
import { auth } from "@/lib/auth"
import { useSession } from "next-auth/react"

const steps = [
  { title: "Personal Info", icon: UserIcon },
  { title: "Choose Plan", icon: RocketIcon },
  { title: "Register Website", icon: GlobeIcon }
]
export default function OnboardingComponent(){
  const {data:session}= useSession();
  console.log(session?.user.name)
  const [currentStep, setCurrentStep] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  useEffect(()=>{
    setApiKey(`${session?.user.apiKey}`)
  })
  const progress = (currentStep / (steps.length - 1)) * 100

  const generateApiKey = () => {
    const key = `dl_${v4()}`
    setApiKey(key)
  }

  const handleDashBoard = () => {
    router.push('/dashboard')
  }

  const handleConfirm = () => {
    setCurrentStep(currentStep + 1)
    setDialogOpen(false)
  }

  const handleViewPremiumPlan = () => {
    router.push('/')
  }

  const handleViewEnterprisePlan = () => {
    router.push('/')
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy API key:', error)
    }
  }

  const nextStep = () => {
    if (currentStep === steps.length - 2) {
      setDialogOpen(true)
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/abstract-pattern.svg"
          alt="Oceanic wave background"
          fill
          className="opacity-20 object-cover"
          priority
        />
      </div>

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl opacity-15 motion-reduce:animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-15 motion-reduce:animate-pulse delay-1000" />

      <Card className="w-full max-w-4xl z-10 bg-gradient-to-b from-cyan-700/80 to-cyan-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 min-h-[600px]">
        <CardHeader className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent text-center tracking-[-0.05em]">
              Welcome Onboard!
            </CardTitle>
            <CardDescription className="text-lg font-medium text-cyan-50 text-center">
              Let&apos;s get you set up in just a few steps.
            </CardDescription>
          </motion.div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-cyan-100">
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-cyan-950/50" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-lg font-medium text-cyan-100">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 bg-cyan-950/50 border-cyan-400/50 text-white placeholder-cyan-300/40 focus:border-cyan-200 focus:ring-cyan-400/30 h-12 text-lg"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-lg font-medium text-cyan-100">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 bg-cyan-950/50 border-cyan-400/50 text-white placeholder-cyan-300/40 focus:border-cyan-200 focus:ring-cyan-400/30 h-12 text-lg"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium text-cyan-100">Your API Key</Label>
                      <div className="flex space-x-3">
                        <div className="relative flex-1">
                          <Input
                            value={apiKey}
                            readOnly
                            className="bg-cyan-950/50 border-cyan-400/50 text-cyan-100 pr-12 font-mono text-lg h-12"
                            placeholder="Click generate to create your API key"
                          />
                          <button
                            onClick={copyApiKey}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200 hover:text-cyan-100 transition-colors"
                            aria-label={copied ? "Copied!" : "Copy API key"}
                          >
                            {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
                          </button>
                        </div>
                        <Button 
                          onClick={generateApiKey} 
                          className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-6 h-12 text-lg font-medium shadow-lg shadow-cyan-500/20"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Label className="text-lg font-medium text-cyan-100">Choose Your Plan</Label>
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      {/* Premium Plan */}
                      <div
                        onClick={handleViewPremiumPlan}
                        className="relative rounded-xl border transition-all duration-300 cursor-pointer
                            border-cyan-400 bg-gradient-to-b from-cyan-600/30 to-cyan-800/30 shadow-lg shadow-cyan-500/10"
                      >
                        <div className="p-6 space-y-4">
                          <h3 className="text-xl font-semibold text-cyan-100">Premium</h3>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-cyan-200">$49</div>
                            <div className="text-sm text-cyan-300/70">per month</div>
                          </div>
                          <p className="text-cyan-100/80">Perfect for growing businesses</p>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-cyan-100">
                              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                              <span>Up to 100,000 API calls</span>
                            </li>
                            <li className="flex items-center gap-2 text-cyan-100">
                              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                              <span>Priority support</span>
                            </li>
                            <li className="flex items-center gap-2 text-cyan-100">
                              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                              <span>Advanced analytics</span>
                            </li>
                          </ul>
                          <Button 
                            onClick={handleViewPremiumPlan}
                            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white"
                          >
                            Select Plan
                          </Button>
                        </div>
                      </div>

                      {/* Enterprise Plan */}
                      <div
                        onClick={handleViewEnterprisePlan}
                        className="relative rounded-xl border transition-all duration-300 cursor-pointer
                            border-cyan-400/20 bg-cyan-950/50 hover:border-cyan-400/50"
                      >
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                          Custom Pricing
                        </div>
                        <div className="p-6 space-y-4">
                          <h3 className="text-xl font-semibold text-cyan-100">Enterprise</h3>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold text-cyan-200">Custom</div>
                            <div className="text-sm text-cyan-300/70">contact sales</div>
                          </div>
                          <p className="text-cyan-100/80">For large scale operations</p>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-cyan-100">
                              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                              <span>Unlimited API calls</span>
                            </li>
                            <li className="flex items-center gap-2 text-cyan-100">
                              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                              <span>24/7 dedicated support</span>
                            </li>
                            <li className="flex items-center gap-2 text-cyan-100">
                              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                              <span>Custom integration</span>
                            </li>
                          </ul>
                          <Button 
                            onClick={handleViewEnterprisePlan}
                            className="w-full bg-cyan-950/50 hover:bg-cyan-900/50 text-white"
                          >
                            Contact Us
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-slate-200/70 text-md mt-4">
                      Current plan: Free
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent mt-24">
                        Onboarded Successfully!
                      </h2>
                      <p className="text-lg font-medium text-cyan-50 mt-2">
                        Go to the dashboard to register your websites
                      </p>
                    </motion.div>

                    <div>
                      <Button
                        onClick={handleDashBoard}
                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-8 h-12 text-lg font-medium shadow-lg shadow-cyan-500/20"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep !== steps.length - 1 && (
                  <div className="flex justify-between mt-10 pt-6 border-t border-cyan-400/20">
                    <Button
                      onClick={prevStep}
                      variant="ghost"
                      disabled={currentStep === 0}
                      className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-800/10 px-6 h-12 text-lg font-medium disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white px-8 h-12 text-lg font-medium shadow-lg shadow-cyan-500/20"
                    >
                      {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-gradient-to-b from-cyan-700/90 to-cyan-800/90 backdrop-blur-xl border border-cyan-500/20">
                <DialogTitle className="text-xl font-semibold text-cyan-100">
                  Are you sure?
                </DialogTitle>
                <DialogDescription className="text-cyan-100/80">
                  Please review your information and click "Continue" if everything is correct. If you need to make changes, click "Cancel".
                </DialogDescription>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button 
                    onClick={() => setDialogOpen(false)} 
                    variant="destructive"
                    className="border-cyan-400/30 text-cyan-100 hover:bg-cyan-800/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm} 
                    className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white"
                  >
                    Continue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}