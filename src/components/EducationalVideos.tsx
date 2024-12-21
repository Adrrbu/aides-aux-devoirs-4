import React, { useState } from 'react';
import { searchYoutubeVideos } from '../services/youtube';
import { Video } from '../types/video';
import SearchBar from './videos/SearchBar';
import VideoGrid from './videos/VideoGrid';
import VideoModal from './videos/VideoModal';
import { SUBJECTS } from '../lib/constants/subjects';
import toast from 'react-hot-toast';

const EducationalVideos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleSearch = async (query?: string) => {
    const searchQuery = query || searchTerm;
    if (!searchQuery.trim()) {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }
    
    setLoading(true);
    try {
      const subject = selectedSubject === 'all' ? '' : SUBJECTS.find(s => s.id === selectedSubject)?.name;
      const finalQuery = `${subject ? subject + ' ' : ''}${searchQuery} cours éducatif`;
      const results = await searchYoutubeVideos(finalQuery);
      
      if (results.length === 0) {
        toast.error('Aucune vidéo trouvée pour cette recherche');
      }
      
      setVideos(results);
    } catch (error) {
      console.error('Error searching videos:', error);
      toast.error('Erreur lors de la recherche des vidéos');
    } finally {
      setLoading(false);
    }
  };

  const cardClasses = "bg-white rounded-2xl p-6 shadow-sm border border-[#151313]";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#151313]">Vidéos éducatives</h2>
      </div>

      <div className={cardClasses}>
        <SearchBar
          searchTerm={searchTerm}
          selectedSubject={selectedSubject}
          loading={loading}
          onSearchChange={setSearchTerm}
          onSubjectChange={setSelectedSubject}
          onSearch={() => handleSearch()}
        />

        <div className="mt-6">
          <VideoGrid
            videos={videos}
            loading={loading}
            onVideoSelect={setSelectedVideo}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default EducationalVideos;