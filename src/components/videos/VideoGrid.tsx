import React from 'react';
import { Play, Clock, Search } from 'lucide-react';
import { Video } from '../../types/video';

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
  onVideoSelect: (video: Video) => void;
  onSearch: (query: string) => void;
}

const SEARCH_SUGGESTIONS = [
  {
    category: 'Mathématiques',
    topics: [
      'Théorème de Pythagore',
      'Équations du second degré',
      'Trigonométrie',
      'Calcul mental'
    ]
  },
  {
    category: 'Français',
    topics: [
      'Analyse de texte',
      'Conjugaison',
      'Figures de style',
      'Dissertation'
    ]
  },
  {
    category: 'Histoire-Géographie',
    topics: [
      'Révolution française',
      'Seconde Guerre mondiale',
      'Géographie de la France',
      'Développement durable'
    ]
  },
  {
    category: 'Sciences',
    topics: [
      'Système solaire',
      'Corps humain',
      'Chimie organique',
      'Électricité'
    ]
  }
];

const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading, onVideoSelect, onSearch }) => {
  const cardClasses = "bg-white rounded-xl border border-[#151313] overflow-hidden hover:border-[#ff5734] transition-colors";

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${cardClasses} animate-pulse`}>
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Play className="mx-auto h-12 w-12 text-[#ff5734]" />
          <h3 className="mt-4 text-lg font-medium text-[#151313]">
            Suggestions de recherche
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Cliquez sur un sujet pour lancer la recherche
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEARCH_SUGGESTIONS.map((category) => (
            <div key={category.category} className={cardClasses}>
              <div className="p-4">
                <h4 className="text-lg font-medium text-[#151313] mb-4">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => onSearch(topic)}
                      className="w-full text-left p-2 rounded-lg text-sm hover:bg-[#f7f7f5] flex items-center group"
                    >
                      <Search className="h-4 w-4 text-gray-400 mr-2 group-hover:text-[#ff5734]" />
                      <span className="text-gray-600 group-hover:text-[#151313]">
                        {topic}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div
          key={video.id}
          className={cardClasses}
          onClick={() => onVideoSelect(video)}
        >
          <div className="relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-md flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {video.duration}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-[#151313] line-clamp-2 mb-2">
              {video.title}
            </h3>
            <p className="text-sm text-gray-500">{video.channelTitle}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                {video.publishedAt}
              </span>
              <span className="text-sm text-[#be94f5] font-medium">
                {video.viewCount} vues
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;