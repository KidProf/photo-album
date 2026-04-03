import { getStories } from '@/lib/data';
import StoryViewer from './StoryViewer';
import NotFoundPage from './../../not-found';

export default async function StoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await params;
  
  const stories = await getStories();

  const targetStory = stories.find(s => s.id === resolvedParams.id);

  if (!targetStory) return <NotFoundPage />;

  const albumStories = stories.filter(s => s.albumId === targetStory.albumId);
  const initialIdx = albumStories.findIndex(s => s.id === resolvedParams.id);

  return <StoryViewer initialIdx={initialIdx} stories={albumStories} />;
}