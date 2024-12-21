import { supabase } from '../lib/supabase';
import { User, UserUpdateData } from '../types/user';
import toast from 'react-hot-toast';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: UserUpdateData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    toast.success('Profil mis à jour avec succès');
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast.error('Erreur lors de la mise à jour du profil');
    return false;
  }
};

export const updateUserAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!fileExt || !allowedTypes.includes(fileExt)) {
      toast.error('Type de fichier non supporté. Utilisez JPG, PNG ou GIF.');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 5MB)');
      return null;
    }

    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await updateUserProfile(userId, { avatarUrl: publicUrl });
    return publicUrl;
  } catch (error) {
    console.error('Error updating avatar:', error);
    toast.error('Erreur lors de la mise à jour de l\'avatar');
    return null;
  }
};