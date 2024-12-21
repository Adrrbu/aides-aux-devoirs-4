import React from 'react';
import { X } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Video } from '../../types/video';

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl border border-[#151313]">
        <div className="flex justify-between items-center p-4 border-b bg-[#fccc42] rounded-t-2xl">
          <h3 className="text-lg font-medium text-[#151313]">{video.title}</h3>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${video.id}`}
            width="100%"
            height="100%"
            controls
            playing
          />
        </div>
        <div className="p-4 bg-[#f7f7f5]">
          <p className="text-sm text-[#151313]">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;