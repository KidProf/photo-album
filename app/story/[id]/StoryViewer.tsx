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
  stories: Story[];
}

export default function StoryViewer({ stories }: StoryViewerProps) {
  const router = useRouter();
  const pathname = usePathname(); // Gives us e.g., "/story/123" or "/slideshow/123"
  
  // 1. Always start at the first story
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);
  const swiperRef = useRef<{ swiper: SwiperType }>(null);
  
  const STORY_DURATION = 5000;

  // 2. Update URL dynamically as the story advances
  useEffect(() => {
    if (stories.length === 0 || !stories[currentIndex]) return;
    
    // Extract the base mode ("story" or "slideshow") from the current URL
    const basePath = pathname.split('/')[1]; 
    const currentStoryId = stories[currentIndex].id;
    
    // Silently update the URL bar without triggering a Next.js server fetch
    window.history.replaceState(null, '', `/${basePath}/${currentStoryId}`);
  }, [currentIndex, stories, pathname]);

  // Handle manual right-clicks
  const handleNextClick = useCallback(() => {
    // 4. If on the last story and they click next, return home
    if (currentIndex >= stories.length - 1) {
      router.push('/');
    } else {
      swiperRef.current?.swiper.slideNext();
    }
  }, [currentIndex, router, stories.length]);

  // Auto-advance logic
  useEffect(() => {
    if (isPaused || stories.length === 0) return;

    const timer = setTimeout(() => {
      handleNextClick();
    }, STORY_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, handleNextClick, isPaused, stories.length]);

  if (stories.length === 0) return null;

  return (
    <div className="flex h-screen w-full justify-center bg-black">
      {/* Changed to black background for a better viewing experience */}
      <div className="relative h-full w-full max-w-md overflow-hidden bg-black shadow-xl">
        
        {/* Top Navigation */}
        <div className="absolute top-0 z-20 flex w-full items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-8">
          <Link href="/" className="text-xl font-bold text-white drop-shadow-md">
            <Image src="/smile-transparent.png" alt="Memories Logo" width={32} height={32} />
          </Link>
          <div className="text-sm font-medium text-white drop-shadow-md max-w-[200px] truncate text-center">
            {stories[currentIndex]?.topDescription}
          </div>
          <div className="w-6" /> {/* Spacer to keep text perfectly centered */}
        </div>

        <Swiper
          ref={swiperRef}
          modules={[EffectFade]}
          effect="fade"
          initialSlide={0} // 1. Enforce starting at the first slide
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          className="h-3/4 w-full"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.id}>
              {/* Interaction areas */}
              <div 
                className="absolute inset-0 z-10 flex"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                {/* 3. Swiper naturally ignores slidePrev() if on the first slide, staying put */}
                <div 
                  className="h-full w-1/3 cursor-pointer" 
                  onClick={() => swiperRef.current?.swiper.slidePrev()} 
                />
                <div 
                  className="h-full w-2/3 cursor-pointer" 
                  onClick={handleNextClick} 
                />
              </div>

              <Image
                src={story.imageUrl}
                alt={story.albumTitle}
                fill
                className="object-contain" // Changed to contain so photos aren't cropped
                unoptimized
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Description */}
        <div className="h-1/4 w-full overflow-y-auto border-t border-gray-800 bg-black p-4">
          <p className="whitespace-pre-wrap text-sm text-gray-200">
            {stories[currentIndex]?.bottomDescription}
          </p>
        </div>

      </div>
    </div>
  );
}