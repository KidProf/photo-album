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
  const [isCopied, setIsCopied] = useState(false);
  
  const currentStory = stories[activeIndex];
  const coverStory = stories[0]; 

  const MAX_LENGTH = 150;
  const text = coverStory.albumDescription;
  const isLong = text.length > MAX_LENGTH;

  const handleCopyLink = () => {
    // Construct the full URL using the current window location and the albumId hash
    const url = `${window.location.origin}/#${currentStory.albumId}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      // Reset the icon back to a link after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <article id={currentStory.albumId} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm scroll-mt-24">
      
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-semibold text-gray-800">
          {currentStory.albumTitle}
        </h2>
        
        {/* 4. The new Copy Link Button */}
        <button 
          onClick={handleCopyLink}
          className="flex items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          title="Copy link to album"
        >
          {isCopied ? (
            // Success Checkmark Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            // Link Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          )}
        </button>
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