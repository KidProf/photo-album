'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Story } from '@/lib/data';

import 'swiper/css';
import 'swiper/css/pagination';

export default function FeedPost({ stories }: { stories: Story[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentStory = stories[activeIndex];
  const coverStory = stories[0]; 

  const MAX_LENGTH = 150;
  const text = coverStory.albumDescription;
  const isLong = text.length > MAX_LENGTH;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-semibold text-gray-800">
          {currentStory.albumTitle}
        </h2>
        
        <Link
          href={`/story/${coverStory.id}`} 
          title="Play Slideshow"
        >
          <svg height="25" width="25">
            <circle cx="12.5" cy="12.5" r="12" stroke="black" strokeWidth="1" fill="none" />
            <polygon 
              points="8,7 19,12.5 8,18" 
              style={{ fill: "black", stroke: "black", strokeWidth: 2 }} 
            />
          </svg>
        </Link>
      </div>
      
     {/* Image & Slider */}
      {/* Added pb-8 to create space for the dots, and custom arbitrary variants to style the active dot */}
      <div className="w-full">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setIsExpanded(false); // Auto-collapse when swiping
          }}
          className="w-full
          [&_.swiper-pagination]:!relative 
          [&_.swiper-pagination]:!bottom-0 
          [&_.swiper-pagination]:!h-5 
          [&_.swiper-pagination-bullet-active]:bg-blue-500 
          [&_.swiper-pagination-bullet]:bg-gray-300" // first 3: position the dots to be outside the image
        >
          {stories.map((story, idx) => (
            <SwiperSlide key={story.id}>
              {/* The image is constrained here, leaving the padding area empty for the dots */}
              <Link 
                href={`/story/${story.id}`} 
                title="Play Slideshow"
              >
                <div className="relative aspect-square w-full bg-gray-50">
                  <Image
                    src={story.imageUrl}
                    alt={story.topDescription || 'Album image'}
                    className="object-cover"
                    fill
                    priority={idx === 0}
                    unoptimized
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* A hack to artificially add space for cards with no pagination */}
      {stories.length === 1 && <div className="h-5" />}
      {/* Description Section */}
      <div className="flex flex-col items-start px-4 pb-4">
        
        {/* Animated Text Container */}
        {/* Transitions max-height from ~2 lines (44px) to massive (800px) */}
        <div 
          className={`relative w-full overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            isExpanded || !isLong ? 'max-h-[800px]' : 'max-h-[44px]'
          }`}
        >
          <p className="text-sm leading-relaxed text-gray-800">
            {/* <span className="mr-2 font-semibold text-gray-900">
              {currentStory.topDescription}
            </span> */}
            {text}
          </p>

          {/* Optional: Add a subtle white fade at the bottom when collapsed to hint at more text */}
          {!isExpanded && isLong && (
            <div className="absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        {/* Expand / Collapse Button */}
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="mt-1 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-800"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        )}
      </div> 
      
    </article>
  );
}