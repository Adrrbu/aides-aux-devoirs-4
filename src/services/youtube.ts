import { Video } from '../types/video';
import toast from 'react-hot-toast';

const API_KEY = 'AIzaSyClHz1EqVFH-gjMLFEa8PHZ7t-uZjxtQsg';

export const searchYoutubeVideos = async (query: string): Promise<Video[]> => {
  try {
    // Add educational context to search query
    const educationalQuery = `${query} cours éducatif -gameplay -streaming`;
    
    // First API call to search for videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${
        encodeURIComponent(educationalQuery)
      }&type=video&relevanceLanguage=fr&regionCode=FR&videoDuration=medium&key=${API_KEY}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!searchResponse.ok) {
      const error = await searchResponse.json();
      console.error('Search API Error:', error);
      throw new Error(error.error?.message || 'Erreur lors de la recherche de vidéos');
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.items?.length) {
      return [];
    }

    // Second API call to get video details
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!detailsResponse.ok) {
      const error = await detailsResponse.json();
      console.error('Details API Error:', error);
      throw new Error(error.error?.message || 'Erreur lors de la récupération des détails');
    }

    const detailsData = await detailsResponse.json();

    if (!detailsData.items?.length) {
      throw new Error('Aucune information détaillée disponible pour ces vidéos');
    }

    return searchData.items.map((item: any, index: number) => {
      const details = detailsData.items[index];
      if (!details) {
        console.warn(`No details found for video ${item.id.videoId}`);
        return null;
      }

      const duration = formatDuration(details.contentDetails.duration);
      const viewCount = parseInt(details.statistics.viewCount || '0');

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('fr-FR'),
        duration,
        viewCount: viewCount.toLocaleString('fr-FR')
      };
    }).filter(Boolean) as Video[];

  } catch (error: any) {
    console.error('Error searching YouTube videos:', error);
    toast.error(error.message || 'Erreur lors de la recherche de vidéos');
    return [];
  }
};

const formatDuration = (duration: string): string => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '0:00';

  const [, hours, minutes, seconds] = matches;
  const parts = [];

  if (hours) {
    parts.push(hours.padStart(2, '0'));
  }
  parts.push(minutes ? minutes.padStart(2, '0') : '00');
  parts.push(seconds ? seconds.padStart(2, '0') : '00');

  return parts.join(':');
};