import React from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AvatarLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARS = [
  {
    category: "Étudiants",
    images: [
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Etudiante.png?t=2024-12-16T09%3A31%3A28.099Z",
        alt: "Étudiante 1"
      },
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Etudiant.png?t=2024-12-16T09%3A31%3A52.960Z",
        alt: "Étudiant 1"
      },
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Etudiant%202.png?t=2024-12-16T09%3A33%3A24.943Z",
        alt: "Étudiant 2"
      },
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Etudiante2.png?t=2024-12-16T09%3A34%3A30.915Z",
        alt: "Étudiante 2"
      }
    ]
  },
  {
    category: "Animaux",
    images: [
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Chat.png?t=2024-12-16T09%3A47%3A01.741Z",
        alt: "Chat"
      },
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Chien.png?t=2024-12-16T09%3A47%3A31.563Z",
        alt: "Chien"
      },
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Hiboux.png?t=2024-12-16T09%3A47%3A38.416Z",
        alt: "Hibou"
      },
      {
        url: "https://sqzeotgydzwvofebxcgw.supabase.co/storage/v1/object/public/avatars/Requin.png?t=2024-12-16T09%3A47%3A42.555Z",
        alt: "Requin"
      }
    ]
  }
];

const AvatarLibrary: React.FC<AvatarLibraryProps> = ({ isOpen, onClose }) => {
  const handleSelectAvatar = async (url: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          avatar_url: url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Avatar mis à jour avec succès');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Erreur lors de la mise à jour de l\'avatar');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#151313]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-[#fccc42] rounded-t-2xl">
          <h2 className="text-xl font-semibold text-[#151313]">
            Choisir un avatar
          </h2>
          <button
            onClick={onClose}
            className="text-[#151313] hover:bg-[#fccc42]/80 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-[#f7f7f5]" style={{ maxHeight: 'calc(90vh - 5rem)' }}>
          <div className="space-y-8">
            {AVATARS.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-medium text-[#151313] mb-4">
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {category.images.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAvatar(avatar.url)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-[#151313] hover:border-[#ff5734] transition-colors"
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarLibrary;