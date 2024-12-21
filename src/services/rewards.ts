import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const calculateQuizReward = (score: number): number => {
  if (score === 100) return 1.00;
  if (score >= 75) return 0.75;
  if (score >= 50) return 0.50;
  if (score >= 25) return 0.25;
  return 0;
};

export const awardQuizReward = async (score: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Appeler la fonction SQL pour attribuer la récompense
    const { data, error } = await supabase.rpc('award_quiz_reward', {
      p_user_id: user.id,
      p_quiz_id: null, // On peut passer null car ce n'est pas critique pour le moment
      p_score: score
    });

    if (error) throw error;

    const reward = data as number;
    if (reward > 0) {
      toast.success(`+${reward.toFixed(2)} izicoin${reward === 1 ? '' : 's'} !`);
    }

    return reward;
  } catch (error) {
    console.error('Error processing quiz score:', error);
    toast.error('Erreur lors de l\'attribution des izicoins');
    throw error;
  }
};