import React from 'react';
import { Clock } from 'lucide-react';

export const SpecificUserSection = () => {
  return (
    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 text-center mt-4 w-full">User&apos;s Configuration</h3>
      </div>
      
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative">
          <Clock className="h-16 w-16 text-gray-400 dark:text-gray-500 animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <span className="flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
          </div>
        </div>
        
        <h2 className="mt-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Coming Soon
        </h2>
        
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center max-w-md">
          We&apos;re working on something exciting! This feature will be available in the near future.
        </p>
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
            <div className="h-2 w-16 bg-blue-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
            <div className="h-2 w-20 bg-blue-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
            <div className="h-2 w-14 bg-blue-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificUserSection;