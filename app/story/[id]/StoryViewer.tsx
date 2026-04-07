'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { Story } from '@/lib/data';

import 'swiper/css';
import 'swiper/css/effect-fade';

interface StoryViewerProps {
  initialIdx: number;
  stories: Story[];
}

export default function StoryViewer({ initialIdx, stories }: StoryViewerProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [currentIndex, setCurrentIndex] = useState(initialIdx);
  const [isPaused, setIsPaused] = useState(false);
  const swiperRef = useRef<{ swiper: SwiperType }>(null);
  
  const STORY_DURATION = 15000;

  // --- NEW REFS FOR TIMING & TOUCH LOGIC ---
  // useRef: change of values would not cause rerender. (While if useState value is changed it will cause rerender)
  const pressStartTimeRef = useRef(0);
  const remainingTimeRef = useRef(STORY_DURATION);
  const startTimeRef = useRef(0);
  const lastIndexRef = useRef(initialIdx);

  useEffect(() => {
    if (stories.length === 0 || !stories[currentIndex]) return;
    const basePath = pathname.split('/')[1]; 
    const currentStoryId = stories[currentIndex].id;
    window.history.replaceState(null, '', `/${basePath}/${currentStoryId}`);
  }, [currentIndex, stories, pathname]);

  const handleComplete = useCallback(() => {
    router.push(`/#${stories[0].albumId}`);
  }, [router, stories]);

  const handleNextClick = useCallback(() => {
    if (currentIndex >= stories.length - 1) {
      handleComplete();
    } else {
      swiperRef.current?.swiper.slideNext();
    }
  }, [currentIndex, stories.length, handleComplete]);

  // --- UPGRADED TIMER LOGIC ---
  useEffect(() => {
    // 1. If the slide changed naturally or via swipe, reset the timer to full 15000ms
    if (lastIndexRef.current !== currentIndex) {
      remainingTimeRef.current = STORY_DURATION;
      lastIndexRef.current = currentIndex;
    }

    if (isPaused || stories.length === 0) return;

    // 2. Mark exactly when the timer started running
    startTimeRef.current = Date.now();
    
    // 3. Set the timeout using the REMAINING time, not the full duration
    const timer = setTimeout(() => {
      handleNextClick();
    }, remainingTimeRef.current);

    return () => {
      clearTimeout(timer);
      // 4. When the effect cleans up (e.g., user pauses), calculate how much time was used
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    };
  }, [currentIndex, isPaused, stories.length, handleNextClick]);

  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const hasText = Boolean(currentStory?.topDescription || currentStory?.bottomDescription);

  return (
    <div className="flex h-screen w-full justify-center bg-black sm:bg-neutral-900">

      {/* Required for the progress bar animation */}
      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      <div className="relative h-full w-full max-w-xl overflow-hidden bg-black shadow-xl">
        
        {/* Progress Bars */}
        <div className="absolute top-0 z-30 flex w-full gap-1 px-2 pt-2">
          {stories.map((story, idx) => (
            <div key={story.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm">
              <div
                className="h-full bg-white"
                style={{
                  // Bars before current are full, bars after are empty
                  width: idx < currentIndex ? '100%' : '0%',
                  animationName: idx === currentIndex ? 'fillProgress' : 'none',
                  animationDuration: `${STORY_DURATION}ms`,
                  animationTimingFunction: 'linear',
                  animationFillMode: 'forwards',
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Navigation */}
        <div className="absolute top-0 z-20 flex w-full items-center justify-start gap-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-4 pb-12 pt-6 pointer-events-none">
          <Link href="/" className="pointer-events-auto drop-shadow-md shrink-0">
            <Image 
              src="/smile-transparent.png" 
              alt="Memories Logo" 
              width={32} 
              height={32} 
              className="rounded-full object-cover" 
            />
          </Link>
          <div className="text-sm font-bold text-white drop-shadow-md truncate">
            {currentStory?.albumTitle}
          </div>
        </div>

        {/* Swiper Container */}
        <Swiper
          ref={swiperRef}
          modules={[EffectFade]}
          effect="fade"
          initialSlide={initialIdx}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          
          // --- UPGRADED TOUCH LOGIC ---
          onTouchStart={() => {
            pressStartTimeRef.current = Date.now(); // Record the exact millisecond of touch
            setIsPaused(true);
          }}
          onTouchEnd={() => setIsPaused(false)}
          onClick={(swiper, event) => {
            // Check how long the finger was down
            const pressDuration = Date.now() - pressStartTimeRef.current;
            
            // If held for more than 200ms, it was a pause, NOT a click. Abort navigation.
            if (pressDuration > 200) return;

            let clickX: number | undefined;
            if ("clientX" in event) {
              clickX = event.clientX;
            } else if ("changedTouches" in event) {
              clickX = event.changedTouches?.[0]?.clientX;
            }
            if (clickX === undefined) return;
            if (clickX < window.innerWidth / 2) { // changed this to 2 for simplicity for logic of bigger screens
              swiper.slidePrev(); 
            } else {
              handleNextClick();
            }
          }}
          className="h-full w-full"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.id} className="bg-black">
              <div 
                className={`relative h-full w-full flex items-center justify-center transition-all ${
                  story.showWholeImage ? 'pt-20 pb-48 sm:pb-36' : ''
                }`}
              >
                <Image
                  src={story.imageUrl}
                  alt={story.albumTitle}
                  fill
                  className="object-contain"
                  unoptimized
                  priority 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Description */}
        {hasText && (
          <div className="absolute bottom-0 z-20 flex w-full flex-col bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pb-6 pt-12 h-48 sm:h-36 pointer-events-none">
            <div 
              className="flex-1 overflow-y-auto pointer-events-auto overscroll-contain pb-2"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <p className="text-sm text-gray-200 drop-shadow-md leading-relaxed whitespace-pre-wrap">
                {currentStory?.topDescription && (
                  <span className="font-semibold text-white mr-2">
                    {currentStory?.topDescription}
                  </span>
                )}
                {currentStory?.bottomDescription}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}