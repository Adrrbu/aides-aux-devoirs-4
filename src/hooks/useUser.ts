import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { getCurrentUser, updateUserProfile, updateUserAvatar } from '../services/user';
import { supabase } from '../lib/supabase';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return false;
    const success = await updateUserProfile(user.id, updates);
    if (success) {
      await loadUser();
    }
    return success;
  };

  const updateAvatar = async (file: File) => {
    if (!user) return null;
    const newAvatarUrl = await updateUserAvatar(user.id, file);
    if (newAvatarUrl) {
      await loadUser();
    }
    return newAvatarUrl;
  };

  return {
    user,
    loading,
    updateProfile,
    updateAvatar,
    refreshUser: loadUser
  };
};