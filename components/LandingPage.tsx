"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Moon, Sun, ArrowRight, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TextGenerateEffect } from "@/components/ui/text-generate"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { TracingBeam } from "@/components/ui/tracing-beam"
import VideoComponent from "./video-player"

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false)

  // Set theme based on system preference initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(isDarkMode)

      // Add smooth scrolling
      document.documentElement.style.scrollBehavior = "smooth"
    }
  }, [])

  // Update theme when changed
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", isDark)
  }, [isDark])

  const features = [
    {
      title: "Alert Notifications",
      description: "Simple, non-intrusive alerts that appear at the top of your website.",
      icon: AlertCircle,
    },
    {
      title: "Alert Dialogs",
      description: "Modal dialogs that ensure your message gets attention from users.",
      icon: MessageSquare,
    },
    {
      title: "Toast Notifications",
      description: "Temporary notifications that appear and disappear automatically.",
      icon: Bell,
    },
    {
      title: "Easy Integration",
      description: "Simple npm command integration with any website or application.",
      icon: CheckCircle2,
    },
    {
      title: "Light & Dark Themes",
      description: "Notifications that adapt to your website's theme automatically.",
      icon: Sun,
    },
    {
      title: "Custom Styling",
      description: "Fully customizable colors, gradients, and branding options.",
      icon: ArrowRight,
    },
  ]

  const steps = [
    {
      title: "Register & Integrate",
      description: "Add and verify your website in the DropLert dashboard.",
    },
    {
      title: "Design Your Notification",
      description: "Choose the type, style, and content of your notification.",
    },
    {
      title: "Notify your users",
      description: "Click a button to send notifications to your users in real time ",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0f] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0e0e0f]/80 border-b border-gray-200 dark:border-gray-800 bg-opacity-50 ">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
                DropLert
              </h1>
              <span className="px-2 py-1 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-medium">
                Beta
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex space-x-6">
                <Link
                  href="#features"
                  className="font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  How It Works
                </Link>
                <Link href="#demo" className="font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Demo
                </Link>
              </div>

              <div className="flex items-center gap-4 ml-auto md:ml-0">
                <Switch
                  checked={isDark}
                  onCheckedChange={setIsDark}
                  id="dark-mode"
                  className="data-[state=checked]:bg-teal-600"
                />
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  {isDark ? <Moon className="h-5 w-5 text-teal-400" /> : <Sun className="h-5 w-5 text-teal-500" />}
                </Label>
              </div>

              <div className="block md:hidden">
                <Button variant="ghost" size="sm" className="p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>

              <div className="hidden md:block">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="rounded-full"
                  as={Link}
                  href="/getstarted"
                  from="from-teal-500"
                  to="to-purple-600"
                  fromOpacity={0.5}
                  toOpacity={0.5}
                >
                  <Button className="rounded-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white">
                    Get Started
                  </Button>
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Improved Hero Section with Enhanced Mobile Responsiveness */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-purple-50/50 dark:from-teal-950/20 dark:to-purple-950/20" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,255,0.1),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(120,0,240,0.15),transparent_50%)]" />
        
        {/* Moving particles background */}
        <BackgroundBeams className="opacity-80" />
        
        {/* Multiple floating notification elements for visual appeal */}
        <div className="absolute top-1/4 right-10 w-48 text-center h-16 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-3 shadow-lg rotate-3 hidden lg:block">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold ml-2">Notification sent</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">Campaign live</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-1/4 left-5 w-60 h-20 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-3 shadow-lg -rotate-6 hidden lg:block">
          <div className="flex items-start justify-center gap-2">
            <Bell className="h-5 w-5  text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold items-center w-full text-center">New subscriber</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs text-center  mt-2">Someone joined your newsletter</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Text content - stacks on mobile, side by side on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20 dark:border-purple-500/20 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="whitespace-nowrap">Boost engagement by 40%</span>
                  </motion.div>
                  
                  {/* Responsive heading with gradient text */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-purple-600">
                      Captivate Users with Live Notifications
                    </span>
                  </h1>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <TextGenerateEffect
                    words="Transform visitor experiences with beautiful, interactive alerts that drive action and skyrocket your conversion rates."
                    className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto lg:mx-0"
                  />
                </motion.div>

                {/* Responsive button layout - stacks on mobile, side by side on larger screens */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <HoverBorderGradient
                    containerClassName="rounded-full w-full sm:w-auto"
                    className="rounded-full w-full sm:w-auto"
                    as={Link}
                    href="/getstarted"
                    from="from-teal-500"
                    to="to-purple-600"
                    fromOpacity={0.5}
                    toOpacity={0.5}
                  >
                    <Button
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white text-lg px-6 sm:px-8 shadow-lg shadow-teal-500/20 dark:shadow-purple-500/20 w-full sm:w-auto"
                    >
                      Start Building <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </HoverBorderGradient>

                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-6 sm:px-8 rounded-full border-2 w-full sm:w-auto"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="text-lg px-6 sm:px-8 rounded-full w-full sm:w-auto hidden sm:inline-flex"
                    onClick={() => {
                      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <Link href="#demo">Watch Demo</Link>
                  </Button>
                </motion.div>

                {/* Social proof section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="mt-10 flex items-center justify-center lg:justify-start"
                >
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden shadow-lg"
                      >
                        <img
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i + 20}.jpg`}
                          alt={`User ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 text-xs font-bold">
                      +96
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">100+</span> developers trust
                      DropLert
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Improved visual element - interactive mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex-1 w-full max-w-lg mx-auto lg:ml-0 mt-10 lg:mt-0"
              >
                <div className="relative">
                  {/* Animated glow effect */}
                  <div className="absolute w-[120%] h-[120%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500/20 to-purple-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                  
                  {/* Main device mockup */}
                  <div className="relative z-10 w-full">
                    <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                      <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl">
                        {/* Browser chrome */}
                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">droplert.app</div>
                          <div className="w-4" />
                        </div>
                        
                        {/* Demo screen with animated notifications */}
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
                          {/* Top notification with animation */}
                          <motion.div 
                            initial={{ x: "120%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                            className="absolute top-4 right-4 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-[80%]"
                          >
                            <div className="flex items-start gap-3">
                              <Bell className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">New message received!</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  John just sent you a new message.
                                </p>
                              
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Bottom notification with animation */}
                          <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="absolute bottom-4 left-4 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-[80%]"
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">New feature available!</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Check out our latest update with improved notifications.
                                </p>
              
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Floating indicator dot with pulse animation */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optional decorative elements */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-teal-500/10 rounded-full blur-lg"></div>
                </div>
                
                {/* Mobile-only watch demo button */}
                <div className="mt-6 text-center block sm:hidden">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-sm rounded-full"
                    onClick={() => {
                      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <Link href="#demo" className="flex items-center justify-center">
                      <span className="mr-2">Watch Demo</span>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M15.5 12L10.5 15.5V8.5L15.5 12Z" fill="currentColor" />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

{/* Video Demo Section - Angled layout with side-by-side content */}
<section id="demo" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/70 to-gray-100/70 dark:from-gray-900/50 dark:to-gray-800/50 skew-y-3 transform-gpu"></div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side content - More breathing room */}
          <motion.div
            className="w-full lg:w-2/5 text-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6">
              Watch & Learn
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">See DropLert in Action</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Discover how easy it is to create beautiful, engaging notifications that drive user action and improve conversion rates.
            </p>
            
            {/* Desktop-only CTA */}
            <div className="hidden md:block">
              <Button 
                size="lg"
                className="rounded-full bg-teal-500 hover:bg-teal-600 text-white font-medium px-8 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </Button>
            </div>
          </motion.div>
          
          {/* Right side video - Larger size */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VideoComponent />
          </motion.div>
        </div>
      </div>
    </section>

      {/* Features Section with Card Hover Effect */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-[#0e0e0f] dark:to-gray-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
              Powerful Features
            </span>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-purple-600">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create engaging notifications that drive user action and improve conversion rates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full backdrop-blur-sm">
                  <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-r from-teal-500/20 to-purple-600/20 text-teal-600 dark:text-teal-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Tracing Beam */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get up and running with DropLert in just three simple steps
            </p>
          </motion.div>

          <TracingBeam className="px-6">
            <div className="max-w-2xl mx-auto">
              {steps.map((step, idx) => (
                <div key={idx} className="mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA Section - Improved and more subtle */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-600/10 dark:from-teal-500/5 dark:to-purple-600/5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Left Content - Takes 3/5 of the space */}
          <div className="col-span-3 p-8 md:p-12">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-medium mb-6">
              Start Today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-purple-600">transform</span> your user experience?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Join the community of developers creating meaningful interactions with their users.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="rounded-full"
                as={Link}
                href="/getstarted"
                from="from-teal-500"
                to="to-purple-600"
                fromOpacity={0.4}
                toOpacity={0.4}
              >
                <Button className="rounded-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white px-6 py-2 shadow-md">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </HoverBorderGradient>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white dark:border-gray-800 overflow-hidden shadow-sm"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i + 20}.jpg`}
                      alt={`User ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">100+</span> developers already using DropLert
              </p>
            </div>
          </div>

          {/* Right Content - Takes 2/5 of the space */}
          <div className="col-span-2 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-purple-600/30"></div>
            <div className="h-full p-8 flex items-center justify-center relative">
              <div className="relative w-full max-w-xs">
                {/* Notification Examples */}
                <div className="absolute -top-4 -left-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform -rotate-3 z-10">
                  <div className="flex items-start gap-2">
                    <Bell className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">New update!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Check out the latest features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform rotate-2 z-10">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Success!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your changes have been saved
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main visual element */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-gray-500">droplert.app</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-teal-500" />
                      <p className="text-xs font-medium">Engage users with notifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-[#0e0e0f] py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-600 bg-clip-text text-transparent">
                  DropLert
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time notifications for your website</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#how-it-works"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#demo"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Demo
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} DropLert. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

