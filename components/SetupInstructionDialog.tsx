import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HelpCircle, Terminal, Layout, FileCode, CheckCircle2, Bell } from 'lucide-react'
import { Tree, Folder, File } from './ui/file-tree'
import { fileTreeData } from '@/lib/fileTreeData'
import { TreeViewElement } from './ui/file-tree'

const SetupInstructionsDialog = () => {
  const [expandedItems] = useState<string[]>(["1","4"]);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <HelpCircle size={16} />
          <span>Setup Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-zinc-200">
            Droplert Setup Guide
          </DialogTitle>
          <div className="text-gray-600 dark:text-zinc-400">
            <DialogDescription>
              Follow these steps to set up Droplert in your Next.js project.
            </DialogDescription>
          </div>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
          <Tabs defaultValue="step1" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="step1"><Terminal className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="step2"><Layout className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="step3"><FileCode className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="step4"><CheckCircle2 className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="step5"><Bell className="w-4 h-4" /></TabsTrigger>
            </TabsList>
            <TabsContent value="step1" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 1: Initialize Droplert</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    Run the following command in <code className="mx-2 px-1 bg-gray-100 dark:bg-gray-800 rounded">your-next-js-project/</code>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <code className="text-sm font-mono">npx droplert init</code>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    This command will set up the necessary files for Droplert in your project.
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                    <Tree 
                      elements={fileTreeData} 
                      className="h-[200px]" 
                      initialExpandedItems={expandedItems}
                    >
                      {fileTreeData.map((element) => (
                        <RenderTreeElement key={element.id} element={element} />
                      ))}
                    </Tree>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ensure you run the command in the root directory of your Next.js project, as shown in the file tree above.
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step2" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 2: Update Root Layout</h3>
                <div className="space-y-2">
                  <div>
                    Open your <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">app/layout.tsx</code> file and add the Droplert component:
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <pre className="text-sm font-mono">
                      {`import Droplert from "@/components/droplert/droplert";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Droplert />
      </body>
    </html>
  )
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step3" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 3: Set Environment Variables</h3>
                <div className="space-y-2">
                  <div>Configure the following environment variables in your project:</div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    <pre className="text-sm font-mono">
                      {`NEXT_PUBLIC_WS_SERVER_URL=${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL}
NEXT_PUBLIC_DROPLERT_ID=
DROPLERT_KEY=`}
                    </pre>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Make sure to add these to your deployment environment (e.g., Vercel) and not just in a local .env file.
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step4" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 4: Verify Your Website</h3>
                <div className="space-y-2">
                  <div>After completing the previous steps and deploying your website:</div>
                  <ol className="list-decimal list-inside">
                    <li>Go to your Droplert dashboard</li>
                    <li>Find the verification section</li>
                    <li>Follow the instructions to verify your deployed website</li>
                  </ol>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    This step ensures that Droplert is correctly set up on your live website.
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step5" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 5: Send a Test Notification</h3>
                <div className="space-y-2">
                  <div>Once your website is verified:</div>
                  <ol className="list-decimal list-inside">
                    <li>Go to your Droplert dashboard</li>
                    <li>Find the &quot;Send Notification&quot; section</li>
                    <li>Compose and send a test notification to your website</li>
                  </ol>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    This confirms that the entire setup is working correctly and you can receive notifications.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-red-500 font-medium">
            Note: Droplert is currently available only for NextJS projects. Droplert is not available on local projects and work on hosted ones only.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const RenderTreeElement = ({ element }: { element: TreeViewElement }) => {
  if (element.children) {
    return (
      <Folder element={element.name} value={element.id}>
        {element.children.map((child) => (
          <RenderTreeElement key={child.id} element={child} />
        ))}
      </Folder>
    )
  }
  return <File value={element.id}>{element.name}</File>
}

export default SetupInstructionsDialog