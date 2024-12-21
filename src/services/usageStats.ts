import { supabase } from '../lib/supabase';
import { PlanLimits } from '../types/subscription';

export const initializeUserStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .upsert([{
        user_id: userId,
        earned_balance: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return await initializeUserStats(user.id);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return null;
  }
};

export const incrementUsageStat = async (
  stat: keyof PlanLimits,
  increment: number = 1
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const currentStats = await getUserStats();
    if (!currentStats) {
      await initializeUserStats(user.id);
    }

    const { error } = await supabase
      .from('user_stats')
      .update({ 
        [stat]: (currentStats?.[stat] || 0) + increment,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error incrementing ${stat}:`, error);
    return false;
  }
};