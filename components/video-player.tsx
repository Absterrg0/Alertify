import { useRef, useState } from 'react';
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { Button } from "@/components/ui/button"; // Adjust path as needed
import type { MediaPlayer as typeMedia } from '@vidstack/react/types/vidstack.js';
export default function VideoComponent() {
  const playerRef = useRef<typeMedia>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const handlePlayClick = () => {
    setIsPlayerVisible(true);
    
    // Give a small delay to ensure the player is mounted before playing
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.play();
      }
    }, 100);
  };

  return (
    <div className="w-full">
      <div className="relative group cursor-pointer">
        {/* Video container with soft padding */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500/20 to-purple-600/20 p-3 md:p-4 shadow-xl">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
            {isPlayerVisible ? (
              <MediaPlayer
                ref={playerRef}
                src="/demo.mp4"
                viewType="video"
                streamType="on-demand"
                logLevel="warn"
                crossOrigin
                playsInline
                title="DropLert Demo Video"
                className="w-full h-full"
              >
                <MediaProvider />
                <DefaultVideoLayout
                  icons={defaultLayoutIcons}
                />
              </MediaPlayer>
            ) : (
              <div className="w-full h-full relative" onClick={handlePlayClick}>
                {/* Thumbnail placeholder - using a div with gradient background */}
                <img 
                  className="w-full h-full bg-gradient-to-br from-gray-300/80 to-gray-400/80 dark:from-gray-700 dark:to-gray-800 object-cover brightness-95 group-hover:brightness-90 transition-all"
                  aria-label="Video thumbnail"
                  src='/image.png'
                />
                
                {/* Play button with enhanced loom effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Outer glow */}
                    <div className="absolute -inset-4 rounded-full bg-white dark:bg-gray-900 opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                    
                    {/* Inner circle */}
                    <div className="h-20 w-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform">
                      <svg className="h-10 w-10 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z" fill="currentColor" />
                      </svg>
                    </div>
                    
                    {/* Pulsing ring animation */}
                    <div className="absolute -inset-4 rounded-full border-2 border-white dark:border-gray-700 opacity-50 group-hover:opacity-70 transition-opacity animate-ping"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute -top-3 -left-3 w-28 h-28 bg-teal-500/10 rounded-full blur-xl"></div>
      </div>
      
      {/* Mobile play button - improved design */}
      <div className="mt-8 text-center block md:hidden">
        <Button 
          variant="outline" 
          size="lg"
          className="rounded-full group flex items-center gap-3 mx-auto hover:bg-teal-50 dark:hover:bg-teal-900/20 shadow-md"
          onClick={() => {
            if (isPlayerVisible) {
              if (playerRef.current?.paused) {
                playerRef.current?.play();
              } else {
                playerRef.current?.pause();
              }
            } else {
              handlePlayClick();
            }
          }}
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40">
            <svg className="h-5 w-5 text-teal-600 dark:text-teal-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-medium">Watch demo</span>
        </Button>
      </div>
    </div>
  );
}