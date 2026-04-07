import { getStories, Story } from '@/lib/data';
import Image from 'next/image';
import FeedPost from '@/components/FeedPost';
import Bio from '@/components/Bio';
import Header from '@/components/Header';

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
    <main className="min-h-screen px-8 xl:px-16">
      
      <Header />

      <Bio />

      <div className="mx-auto w-full py-8 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groupedAlbums.map((albumStories) => (
            <FeedPost key={albumStories[0].albumId} stories={albumStories} />
          ))}
        </div>
      </div>
      
    </main>
  );
}