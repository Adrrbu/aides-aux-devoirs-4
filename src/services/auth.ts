import { supabase } from '../lib/supabase';
import { AuthResponse } from '../types/auth';
import toast from 'react-hot-toast';

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> => {
  try {
    // 1. Créer l'utilisateur dans Auth
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

    // 2. Attendre que l'utilisateur soit créé dans auth
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Créer le profil utilisateur avec RLS désactivé
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      in_user_id: data.user.id,
      in_user_email: email,
      in_user_first_name: firstName,
      in_user_last_name: lastName
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      await supabase.auth.admin.deleteUser(data.user.id).catch(console.error);
      throw profileError;
    }

    return { 
      success: true,
      user: data.user,
      message: 'Compte créé avec succès ! Vérifiez votre email.'
    };
  } catch (error: any) {
    console.error('Error during signup:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la création du compte'
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error during signin:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la connexion'
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error during signout:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la déconnexion'
    };
  }
};