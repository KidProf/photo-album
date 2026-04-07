'use client';

import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  onStart?: () => void;
  onEnd?: () => void;
  className?: string; // Allows for custom sizing/positioning
}

export default function ShareButton({ 
  url, 
  title, 
  text,
  onStart, 
  onEnd, 
  className = "" 
}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const handlePress = async (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent the click from triggering parent events (like opening a story)
    e.stopPropagation();

    if (onStart) onStart();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Share',
          text: text || '',
          url: url,
        });
        if (onEnd) onEnd();
      } catch (error) {
        // Users frequently dismiss the share sheet without sharing, which throws a harmless error.
        if (onEnd) onEnd();
      }
    } else {
      // Fallback for browsers that don't support native sharing (e.g., older desktop browsers)
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
          if (onEnd) onEnd();
        }, 2000);
      });
    }
  };

  return (
    <button 
      onClick={handlePress}
      className={`flex items-center justify-center rounded-md transition-all duration-200 active:scale-95 active:opacity-70 ${className}`}
      title="Share"
    >
      {isCopied ? (
        // Success Checkmark
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-full w-full text-green-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        // Standard Share Icon (Universal)
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-full w-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      )}
    </button>
  );
}