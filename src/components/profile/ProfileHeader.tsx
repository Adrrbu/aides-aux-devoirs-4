import React from 'react';
import { User, Settings, Calendar, Wallet, BookOpen } from 'lucide-react';

interface ProfileHeaderProps {
  profile: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAvatarUpload: (file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  activeSection,
  onSectionChange,
  onAvatarUpload,
}) => {
  const sections = [
    { id: 'general', label: 'Général', icon: User },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
    { id: 'wallet', label: 'Portefeuille', icon: Wallet },
    { id: 'learning-difficulties', label: 'Difficultés', icon: BookOpen },
  ];

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 h-48 rounded-2xl" />
      <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-card border-4 border-background shadow-sm">
                <img
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt={profile.full_name || 'Profile'}
                  className="h-full w-full object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-white text-sm">Modifier</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-card-foreground">
                {profile.full_name || 'Utilisateur'}
              </h1>
              <p className="text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4 border-t border-default pt-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;