import React from 'react';
import { Clock } from 'lucide-react';
import { Video } from '../../types/video';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="relative cursor-pointer" 
        onClick={() => onSelect(video)}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 
          className="text-lg font-medium text-gray-900 mb-1 cursor-pointer hover:text-indigo-600"
          onClick={() => onSelect(video)}
        >
          {video.title}
        </h3>
        <p className="text-sm text-gray-500">{video.channelTitle}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            {video.publishedAt}
          </span>
          <span className="text-sm text-gray-500">
            {video.viewCount} vues
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;