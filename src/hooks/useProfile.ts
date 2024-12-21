import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockAuth } from '../lib/auth/mockAuth';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
  has_completed_onboarding: boolean;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    calendar: {
      defaultView: string;
      startHour: number;
      endHour: number;
    };
  };
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('Loading user profile...');
      setError(null);

      if (import.meta.env.DEV) {
        console.log('Using mock profile in development');
        await new Promise(resolve => setTimeout(resolve, 500));
        setProfile(mockAuth.user as UserProfile);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No profile data found');

      console.log('Profile data loaded:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    refreshProfile: loadProfile
  };
};