import { supabase } from '../supabase';
import { AuthResponse } from './types';

const createUserProfile = async (userId: string, email: string, firstName: string, lastName: string) => {
  console.log('Creating user profile for:', userId);
  
  // Create all user data in a single transaction
  const { error } = await supabase.rpc('create_user_profile', {
    p_user_id: userId,
    p_email: email,
    p_first_name: firstName,
    p_last_name: lastName
  });

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> => {
  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError) throw authError;
    if (!authData.user) throw new Error('Aucune donnée utilisateur retournée');

    // Step 2: Create user profile, wallet, and statistics
    await createUserProfile(authData.user.id, email, firstName, lastName);

    return { 
      success: true,
      user: authData.user,
      message: 'Compte créé avec succès ! Vérifiez votre email.'
    };
  } catch (error: any) {
    // If we get a duplicate error, it means the user already exists
    if (error.code === '23505') {
      return {
        success: false,
        error: 'Un compte avec cet email existe déjà'
      };
    }
    throw error;
  }
};

export const signInUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
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
};

export const signOutUser = async (): Promise<AuthResponse> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  return {
    success: true,
    message: 'Déconnexion réussie'
  };
};