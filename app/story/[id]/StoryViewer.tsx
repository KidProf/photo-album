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
  
  const STORY_DURATION = 5000;

  useEffect(() => {
    if (stories.length === 0 || !stories[currentIndex]) return;
    const basePath = pathname.split('/')[1]; 
    const currentStoryId = stories[currentIndex].id;
    window.history.replaceState(null, '', `/${basePath}/${currentStoryId}`);
  }, [currentIndex, stories, pathname]);

  const handleComplete = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleNextClick = useCallback(() => {
    if (currentIndex >= stories.length - 1) {
      handleComplete();
    } else {
      swiperRef.current?.swiper.slideNext();
    }
  }, [currentIndex, stories.length, handleComplete]);

  useEffect(() => {
    if (isPaused || stories.length === 0) return;
    const timer = setTimeout(() => {
      handleNextClick();
    }, STORY_DURATION);
    return () => clearTimeout(timer);
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
        
        {/* 1. Progress Bars */}
        <div className="absolute top-0 z-30 flex w-full gap-1 px-2 pt-2">
          {stories.map((story, idx) => (
            <div key={story.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm">
              <div
                className="h-full bg-white"
                style={{
                  // Bars before current are full, bars after are empty
                  width: idx < currentIndex ? '100%' : '0%',
                  
                  // Break the shorthand into individual properties to satisfy React
                  animationName: idx === currentIndex ? 'fillProgress' : 'none',
                  animationDuration: `${STORY_DURATION}ms`,
                  animationTimingFunction: 'linear',
                  animationFillMode: 'forwards',
                  
                  // Now play state can be updated independently without conflict!
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
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onClick={(swiper, event) => {
            let clickX: number | undefined;
            if ("clientX" in event) {
              clickX = event.clientX;
            } else if ("changedTouches" in event) {
              clickX = event.changedTouches?.[0]?.clientX;
            }
            if (clickX === undefined) return;
            if (clickX < window.innerWidth / 3) {
              swiper.slidePrev(); 
            } else {
              handleNextClick();
            }
          }}
          className="h-full w-full"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.id} className="bg-black">
              {/* Responsive safe-area padding for showWholeImage */}
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
          // Responsive height container matching the showWholeImage padding
          <div className="absolute bottom-0 z-20 flex w-full flex-col bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pb-6 pt-12 h-48 sm:h-36 pointer-events-none">
            
            {/* 2. Scrollable container that controls the pause state */}
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