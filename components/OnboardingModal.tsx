import { useEffect, useState } from "react"
import { v4 } from "uuid"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { CheckIcon, CopyIcon, AlertTriangle, Terminal } from 'lucide-react'
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {toast} from '@/hooks/use-toast'
import SetupInstructionsDialog from './SetupInstructionDialog'

export default function OnboardingModal() {
  const [apiKey, setApiKey] = useState('')
  const [droplertId,setDroplertId]=useState('')
  const [copiedApiKey, setCopiedApiKey] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [copiedDroplertId,setCopiedDroplertId]=useState(false)

  useEffect(() => {
    fetchApiKey()
  }, [])

  const fetchApiKey=async()=>{
    const response = await axios.get('/api/user/apiKey')
    setApiKey(response?.data?.apiKey)
    setDroplertId(response.data.droplertId)
  }

  const generateApiKey = () => {
    return `dl_${v4()}`
  }
  
  const updateApiKey = async (apiKey: string) => {
    try {
      const response = await axios.put('/api/user/apiKey', { apiKey })
      if (response.status === 200) {
        toast({
          title: 'API key successfully updated',
        })
      } else {
        toast({
          title: 'Error updating API key, try again later',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error("Error updating API key:", error)
      toast({
        title: 'Error updating API key, try again later',
        variant: 'destructive',
      })
    }
  }
  
  const handleGenerateClick = () => {
    setShowDialog(true)
  }
  
  const handleConfirmGenerate = async () => {
    const newApiKey = generateApiKey()
    setApiKey(newApiKey)
    await updateApiKey(newApiKey)
    setShowDialog(false)
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(`DROPLERT_KEY=${apiKey}`)
      setCopiedApiKey(true)
      setTimeout(() => setCopiedApiKey(false), 2000)
    } catch (error) {
      console.error('Failed to copy API key:', error)
    }
  }

  const copyDroplertId = async () => {
    try {
      await navigator.clipboard.writeText(`NEXT_PUBLIC_DROPLERT_ID=${droplertId}`)
      setCopiedDroplertId(true)
      setTimeout(() => setCopiedDroplertId(false), 2000)
    } catch (error) {
      console.error('Failed to copy API key:', error)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700 w-full max-w-3xl mx-auto rounded-xl overflow-hidden transition-all duration-300 relative">
      <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 bg-gray-200/50 dark:bg-zinc-700/30 rounded-lg backdrop-blur-sm">
              <Terminal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-zinc-300" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-zinc-200">
              Initialize Droplert
            </CardTitle>
          </div>
          <SetupInstructionsDialog />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative p-3 sm:p-4 bg-white dark:bg-zinc-800 shadow-md dark:shadow-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-zinc-900/70 transition-all duration-300 ease-out">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">
                  Run this command to initialize droplert in your project&apos;s <strong>Root</strong>:
                </p>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-lg blur" />
                <div className="relative bg-gray-50 dark:bg-zinc-900 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm border border-gray-200 dark:border-zinc-700 overflow-x-auto">
                  <code className="text-blue-600 dark:text-blue-400 whitespace-nowrap">npx droplert init</code>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 relative p-3 sm:p-4 bg-white dark:bg-zinc-800 shadow-md dark:shadow-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-zinc-900/70 transition-all duration-300 ease-out">
              <Label className="text-sm sm:text-base text-gray-700 dark:text-zinc-300 font-medium mb-3 sm:mb-4 block">
                Your droplert ID
              </Label>
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1 group">
                  <Input
                    value={droplertId}
                    readOnly
                    className="font-mono text-xs sm:text-sm bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 pr-12"
                  />
                  <button
                    onClick={copyDroplertId}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    {copiedDroplertId ? (
                      <CheckIcon size={16} className="text-green-500" />
                    ) : (
                      <CopyIcon size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 relative p-3 sm:p-4 bg-white dark:bg-zinc-800 shadow-md dark:shadow-zinc-900/50 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-zinc-900/70 transition-all duration-300 ease-out">
              <Label className="text-sm sm:text-base text-gray-700 dark:text-zinc-300 font-medium mb-3 sm:mb-4 block">
                Your API Key
              </Label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1 group">
                  <Input
                    value={apiKey}
                    readOnly
                    className="font-mono text-xs sm:text-sm bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 pr-12"
                  />
                  <button
                    onClick={copyApiKey}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    {copiedApiKey ? (
                      <CheckIcon size={16} className="text-green-500" />
                    ) : (
                      <CopyIcon size={16} />
                    )}
                  </button>
                </div>
                <Button
                  onClick={handleGenerateClick}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                >
                  Generate
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 mx-4 sm:mx-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-gray-800 dark:text-zinc-200">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Generate New API Key?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">
              This action will invalidate your current API key. Any applications using this key will need to be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmGenerate}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all duration-300"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}