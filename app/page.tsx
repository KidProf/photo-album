import { getStories, Story } from '@/lib/data';
import Image from 'next/image';
import FeedPost from '@/components/FeedPost';

export default async function Home() {
  const allStories = await getStories();

  const albumsMap = new Map<string, Story[]>();
  
  allStories.forEach((story) => {
    if (!albumsMap.has(story.albumId)) {
      albumsMap.set(story.albumId, []);
    }
    albumsMap.get(story.albumId)!.push(story);
  });

  const groupedAlbums = Array.from(albumsMap.values());

  return (
    <main className="min-h-screen bg-white">
      
      {/* <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-md text-black"> */}
      <header className="flex justify-center items-center px-4 py-4 border-b border-gray-200 text-black">
        <Image src="/smile-black-transparent.png" alt="Memories Logo" width={32} height={32} className="mr-2" />
        <h1 className="font-bold text-xl">&apos;s Photo Album</h1>
      </header>

      <div className="mx-auto w-full px-8 xl:px-16 py-8 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groupedAlbums.map((albumStories) => (
            <FeedPost key={albumStories[0].albumId} stories={albumStories} />
          ))}
        </div>
      </div>
      
    </main>
  );
}