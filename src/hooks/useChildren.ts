import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useChildren = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select('*')
        .eq('parent_id', user.id);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    children,
    loading,
    refreshChildren: loadChildren
  };
};