import Papa from 'papaparse';

export interface Story {
  id: string;             // This is now the imageId
  albumId: string;        // URL-safe slug (e.g., "summer-2025")
  albumTitle: string;     // Exact text from the 'album' column
  imageUrl: string;
  topDescription: string;
  bottomDescription: string;
  isCover: boolean;       // Programmatically set to true for the first image of an album
  albumDescription: string;
  showWholeImage: boolean;
}

// Your exact requested CSV headers
interface CsvRow {
  album: string;
  topDescription: string;
  bottomDescription: string;
  imageId: string;
  albumDescription: string;
  showWholeImage: string;
}

export async function getStories(): Promise<Story[]> {
  const csvUrl = process.env.GOOGLE_CSV_URL;

  if (!csvUrl) {
    throw new Error("Missing GOOGLE_CSV_URL in environment variables.");
  }

  const response = await fetch(csvUrl, { 
    next: { revalidate: 60 } 
  });
  
  const csvText = await response.text();

  const parsedData = Papa.parse<CsvRow>(csvText, {
    header: true, 
    skipEmptyLines: true, 
  });

  const allStories: Story[] = [];
  const seenAlbums = new Set<string>();

  parsedData.data.forEach((row) => {
    // Skip empty rows or rows where you forgot to paste the image ID
    if (!row.imageId) return; 

    const albumTitle = row.album || 'Memories';
    // Convert "Summer Vacation 2025!" to "summer-vacation-2025" for clean filtering
    const albumId = albumTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // If the Set doesn't have this albumId yet, it's the first one we're seeing!
    const isCover = !seenAlbums.has(albumId);
    if (isCover) {
      seenAlbums.add(albumId); // Add it to the Set so subsequent photos aren't covers
    }

    // Parse "Yes" (case-insensitive) into a boolean
    const showWhole = row.showWholeImage?.toLowerCase().trim() === 'yes';

    allStories.push({
      id: row.imageId, // Using imageId as the unique route parameter
      albumId: albumId,
      albumTitle: albumTitle,
      imageUrl: `https://drive.google.com/thumbnail?id=${row.imageId}&sz=w1000`,
      topDescription: row.topDescription || '',
      bottomDescription: row.bottomDescription || '',
      isCover: isCover,
      albumDescription: row.albumDescription || '',
      showWholeImage: showWhole,
    });
  });
  
  return allStories;
}