import { supabase } from '../../../lib/supabase';
import { handleSupabaseError } from '../../../lib/utils/error';
import toast from 'react-hot-toast';

export const signIn = async (email: string, password: string, role?: 'student' | 'parent') => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Verify user role if specified
    if (role) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      if (profile.role !== role) {
        await supabase.auth.signOut();
        throw new Error(`Ce compte n'est pas un compte ${role === 'parent' ? 'parent' : 'élève'}`);
      }
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error signing in:', error);
    const message = handleSupabaseError(error);
    toast.error(message);
    throw error;
  }
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'student' | 'parent'
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role
        }
      }
    });

    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error signing up:', error);
    const message = handleSupabaseError(error);
    toast.error(message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error('Erreur lors de la déconnexion');
    throw error;
  }
};