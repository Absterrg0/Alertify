import { Ban } from "lucide-react";




export default function EmptyState(){
    return <div>
          <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6">
  <div className="flex justify-between items-center">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 text-center mt-4 w-full">
      Route Configuration
    </h3>
  </div>

  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="relative">
      <Ban className="h-16 w-16 text-gray-400 dark:text-gray-500" />
    </div>

    <h2 className="mt-6 text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
      Cannot Be Used for More Than One Website
    </h2>

    <p className="mt-4 text-gray-600 dark:text-gray-400 text-center max-w-md">
      This configuration is limited to a single website.<br></br>Select only one website in dashboard to use
    </p>

    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
      <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
        <div className="h-2 w-16 bg-red-200 dark:bg-red-800 rounded animate-pulse mx-auto"></div>
      </div>
      <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
        <div className="h-2 w-20 bg-red-200 dark:bg-red-800 rounded animate-pulse mx-auto"></div>
      </div>
      <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
        <div className="h-2 w-14 bg-red-200 dark:bg-red-800 rounded animate-pulse mx-auto"></div>
      </div>
    </div>
  </div>
</div>
    </div>
}