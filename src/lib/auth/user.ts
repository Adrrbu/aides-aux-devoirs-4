import { supabase } from '../supabase';
import { AuthResponse } from './types';
import toast from 'react-hot-toast';

export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'user'
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Aucune donnée utilisateur retournée');

    return { 
      success: true,
      user: data.user,
      message: 'Compte créé avec succès ! Vérifiez votre email.'
    };
  } catch (error: any) {
    console.error('Error during signup:', error);
    toast.error(error.message || 'Erreur lors de la création du compte');
    return {
      success: false,
      error: error.message
    };
  }
};

export const signInUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return {
      success: true,
      user: data.user,
      message: 'Connexion réussie !'
    };
  } catch (error: any) {
    console.error('Error during signin:', error);
    toast.error(error.message || 'Erreur lors de la connexion');
    return {
      success: false,
      error: error.message
    };
  }
};

export const signOutUser = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return {
      success: true,
      message: 'Déconnexion réussie'
    };
  } catch (error: any) {
    console.error('Error during signout:', error);
    toast.error(error.message || 'Erreur lors de la déconnexion');
    return {
      success: false,
      error: error.message
    };
  }
};