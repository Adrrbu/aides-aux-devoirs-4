import { supabase } from '../supabase';
import { handleSupabaseError } from '../utils/error';
import toast from 'react-hot-toast';

export const initializeDatabase = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    // Verify user exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    // If user doesn't exist, create profile with role 'user'
    if (!existingUser) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: 'student', // S'assurer que le rôle est 'user'
          has_completed_onboarding: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;
    }

    // Initialize wallet if it doesn't exist
    const { data: existingWallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!existingWallet) {
      const { error: walletError } = await supabase
        .from('wallets')
        .insert([{
          user_id: user.id,
          balance: 0,
          created_at: new Date().toISOString()
        }]);

      if (walletError) throw walletError;
    }

    return true;
  } catch (error: any) {
    console.error('Error initializing database:', error);
    const message = handleSupabaseError(error);
    toast.error(message);
    throw error;
  }
};