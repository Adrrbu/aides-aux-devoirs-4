import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ProfileHeader from './sections/ProfileHeader';
import GeneralSection from './sections/GeneralSection';
import PreferencesSection from './PreferencesSection';
import ScheduleSection from './sections/ScheduleSection';
import WalletSection from './sections/WalletSection';
import LearningDifficultiesSection from './sections/LearningDifficultiesSection';
import LoadingSpinner from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface ProfilePageProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ initialTab = 'general', onTabChange }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(initialTab);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    setActiveSection(initialTab);
  }, [initialTab]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      if (!profile) return;

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
      
      if (!fileExt || !allowedTypes.includes(fileExt)) {
        toast.error('Type de fichier non supporté. Utilisez JPG, PNG ou GIF.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 5MB)');
        return;
      }

      if (profile.avatar_url) {
        const oldFilePath = profile.avatar_url.split('/').pop();
        if (oldFilePath) {
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
        }
      }

      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Photo de profil mise à jour');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Erreur lors de la mise à jour de la photo de profil');
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (onTabChange) {
      onTabChange(section);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-[#151313]">Erreur lors du chargement du profil</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <ProfileHeader
        profile={profile}
        onAvatarUpload={handleAvatarUpload}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeSection === 'general' && (
            <GeneralSection profile={profile} />
          )}
          {activeSection === 'preferences' && (
            <PreferencesSection
              preferences={{
                notifications: {
                  email: profile.preferences?.notifications?.email ?? false,
                  push: profile.preferences?.notifications?.push ?? false,
                },
                calendar: {
                  defaultView: profile.preferences?.calendar?.defaultView ?? 'week',
                  startHour: profile.preferences?.calendar?.startHour ?? 8,
                  endHour: profile.preferences?.calendar?.endHour ?? 18,
                },
              }}
              onUpdate={async (newPreferences) => {
                try {
                  const { error } = await supabase
                    .from('users')
                    .update({
                      preferences: {
                        ...profile.preferences,
                        ...newPreferences,
                      },
                      updated_at: new Date().toISOString(),
                    })
                    .eq('id', profile.id);

                  if (error) throw error;

                  setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      ...newPreferences,
                    },
                  });

                  toast.success('Préférences mises à jour');
                } catch (error) {
                  console.error('Error updating preferences:', error);
                  toast.error('Erreur lors de la mise à jour des préférences');
                }
              }}
            />
          )}
          {activeSection === 'schedule' && (
            <ScheduleSection userId={profile.id} />
          )}
          {activeSection === 'wallet' && (
            <WalletSection userId={profile.id} />
          )}
          {activeSection === 'learning-difficulties' && (
            <LearningDifficultiesSection />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Statistiques du profil
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">Décembre 2023</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Exercices complétés</p>
                <p className="text-lg font-medium text-[#ff5734]">127</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Temps total d'étude</p>
                <p className="text-lg font-medium text-[#be94f5]">47h</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Progression moyenne</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full bg-[#fccc42]"
                      style={{ width: '75%' }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;