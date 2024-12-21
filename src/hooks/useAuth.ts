import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { signUpUser, signInUser, signOutUser } from '../lib/auth/user';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const signupInProgress = useRef(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    // Prevent multiple signup attempts
    if (signupInProgress.current) {
      console.log('Signup already in progress, skipping duplicate attempt');
      return;
    }

    try {
      signupInProgress.current = true;
      setLoading(true);
      const result = await signUpUser(email, password, firstName, lastName);
      if (result.success) {
        toast.success(result.message);
      }
      return result;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Erreur lors de la création du compte');
      throw error;
    } finally {
      setLoading(false);
      signupInProgress.current = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInUser(email, password);
      if (result.success) {
        toast.success(result.message);
      }
      return result;
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        toast.success(result.message);
      }
      return result;
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error(error.message || 'Erreur lors de la déconnexion');
      throw error;
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};