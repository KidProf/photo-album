import Image from 'next/image';
import Link from 'next/link';
import { getStories } from '@/lib/data';

export const revalidate = 60; 

export default async function Home() {
  const stories = await getStories();

  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-gray-200 bg-white py-4">
        <Image src="/smile-black-transparent.png" alt="Memories Logo" width={32} height={32} className="mr-2" />
        {/* <h1 className="text-xl font-bold text-gray-900">Memories</h1> */}
      </header>

      <div className="mx-auto w-full max-w-md pb-20">
        {stories
        .filter((story) => story.isCover)
        .map((story) => (
          <article key={story.id} className="mb-8 border-b border-gray-100 pb-4">
            <div className="px-4 py-3">
              <h2 className="font-semibold text-gray-800">{story.albumTitle}</h2>
            </div>
            
            <Link href={`/story/${story.id}`}>
              <div className="relative aspect-square w-full cursor-pointer bg-gray-50">
                <Image
                  src={story.imageUrl}
                  alt={story.topDescription}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </Link>

            <div className="px-4 py-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900 mr-2">{story.topDescription}</span>
                {story.bottomDescription}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}