import React from 'react';
import { Camera, Settings, Calendar, Wallet, Brain, User } from 'lucide-react';
import AvatarLibrary from '../AvatarLibrary';

interface ProfileHeaderProps {
  profile: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  onAvatarUpload: (file: File) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onAvatarUpload,
  activeSection,
  onSectionChange
}) => {
  const [showAvatarLibrary, setShowAvatarLibrary] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpload(e.target.files[0]);
    }
  };

  return (
    <div className="relative">
      {/* Bannière de couverture */}
      <div className="h-48 bg-[#ff5734] rounded-2xl relative">
        {/* Avatar et nom centrés verticalement dans la bannière */}
        <div className="absolute inset-0 flex items-center px-8">
          <div className="flex items-center space-x-6">
            {/* Avatar avec options de modification */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#f7f7f5] flex items-center justify-center">
                    <span className="text-4xl font-medium text-[#151313]">
                      {profile.first_name[0]}{profile.last_name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <label className="cursor-pointer bg-white rounded-full p-2 shadow-lg hover:bg-[#f7f7f5] transition-colors border border-[#151313]">
                  <Camera className="h-4 w-4 text-[#151313]" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  onClick={() => setShowAvatarLibrary(true)}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-[#f7f7f5] transition-colors border border-[#151313]"
                >
                  <User className="h-4 w-4 text-[#151313]" />
                </button>
              </div>
            </div>

            {/* Nom */}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {profile.first_name} {profile.last_name}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => onSectionChange('general')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'general'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Général
          </button>
          <button
            onClick={() => onSectionChange('preferences')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'preferences'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Préférences
            </div>
          </button>
          <button
            onClick={() => onSectionChange('schedule')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'schedule'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Emploi du temps
            </div>
          </button>
          <button
            onClick={() => onSectionChange('wallet')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'wallet'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Ma cagnotte
            </div>
          </button>
          <button
            onClick={() => onSectionChange('learning-difficulties')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'learning-difficulties'
                ? 'border-[#ff5734] text-[#ff5734]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Difficultés d'Apprentissage
            </div>
          </button>
        </nav>
      </div>

      <AvatarLibrary
        isOpen={showAvatarLibrary}
        onClose={() => setShowAvatarLibrary(false)}
        onSelect={(url) => {
          // Implémenter la logique de mise à jour de l'avatar
          setShowAvatarLibrary(false);
        }}
      />
    </div>
  );
};

export default ProfileHeader;