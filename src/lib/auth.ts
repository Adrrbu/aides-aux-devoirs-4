import { supabase } from './supabase';

export const createUserAccount = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    console.log('Creating user account:', { email, firstName, lastName });

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!authData.user) {
      console.error('No user data returned');
      throw new Error('No user data returned');
    }

    console.log('User created successfully:', authData.user);
    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Error creating user account:', error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    console.log('Signing in user:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('User signed in successfully:', data.user);
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};