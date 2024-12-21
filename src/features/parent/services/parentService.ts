import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export const addChild = async (childEmail: string, pinCode: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data: childId, error } = await supabase.rpc('link_parent_child', {
      p_parent_id: user.id,
      p_child_email: childEmail,
      p_pin_code: pinCode
    });

    if (error) throw error;
    return childId;
  } catch (error: any) {
    console.error('Error adding child:', error);
    toast.error(error.message || 'Erreur lors de l\'ajout de l\'enfant');
    throw error;
  }
};

export const getChildren = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
      .from('parent_child_relationships')
      .select('*')
      .eq('parent_id', user.id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading children:', error);
    throw error;
  }
};

export const removeChild = async (childId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { error } = await supabase
      .from('parent_child_relationships')
      .delete()
      .eq('parent_id', user.id)
      .eq('child_id', childId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing child:', error);
    throw error;
  }
};