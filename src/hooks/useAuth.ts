import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/auth/config';
import { signUpUser, signInUser, signOutUser } from '../lib/auth/user';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      await signUpUser(email, password, firstName, lastName);
      toast.success('Compte créé avec succès ! Vérifiez votre email.');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Erreur lors de la création du compte');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      return await signInUser(email, password);
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
      await signOutUser();
      toast.success('Déconnexion réussie');
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