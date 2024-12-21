import { supabase } from '../supabase';
import { retry } from '../utils/retry';
import { sleep } from '../utils/time';
import toast from 'react-hot-toast';

const INITIALIZATION_DELAY = 1000;

export const initializeUserProfile = async (
  userId: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  const profile = {
    id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
    role: 'user',
    has_completed_onboarding: false,
    preferences: {
      theme: 'light',
      notifications: {
        email: false,
        push: false
      },
      calendar: {
        defaultView: 'week',
        startHour: 8,
        endHour: 18
      }
    }
  };

  const { error } = await retry(async () => {
    return await supabase
      .from('users')
      .upsert([profile], {
        onConflict: 'id'
      });
  });

  if (error) throw error;
  return profile;
};

export const initializeNewUser = async (
  userId: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  try {
    await sleep(INITIALIZATION_DELAY);
    await initializeUserProfile(userId, email, firstName, lastName);
    toast.success('Compte créé avec succès !');
  } catch (error) {
    console.error('Error initializing user:', error);
    await supabase.auth.admin.deleteUser(userId).catch(console.error);
    throw error;
  }
};