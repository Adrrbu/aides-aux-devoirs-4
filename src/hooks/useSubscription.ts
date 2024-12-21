import { useState, useEffect, useCallback } from 'react';
import { SUBSCRIPTION_PLANS } from '../lib/stripe/plans';
import { PlanLimits, Subscription } from '../types/subscription';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<Partial<Record<keyof PlanLimits, number>>>({
    aiquestions: 0,
    exercisesperday: 0
  });

  const fetchSubscription = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      // Use the RPC function to safely get or create subscription
      const { data, error } = await supabase
        .rpc('get_or_create_subscription', {
          p_user_id: user.id
        });

      if (error) throw error;

      if (data) {
        setSubscription(data);
      }
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      toast.error('Erreur lors de la récupération de l\'abonnement');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchUsageStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('usage_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUsageStats(data);
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUsageStats();
    } else {
      setSubscription(null);
      setUsageStats({
        aiquestions: 0,
        exercisesperday: 0
      });
    }
  }, [user, fetchSubscription, fetchUsageStats]);

  const getCurrentPlan = () => {
    if (!subscription) return SUBSCRIPTION_PLANS.DECOUVERTE;
    return SUBSCRIPTION_PLANS[subscription.plan_id as keyof typeof SUBSCRIPTION_PLANS];
  };

  const checkLimit = (limitType: keyof PlanLimits, currentUsage: number) => {
    const plan = getCurrentPlan();
    const limit = plan.limits[limitType];

    if (typeof limit === 'number') {
      if (limit === -1) return true;
      if (currentUsage >= limit) {
        toast.error(`Vous avez atteint votre limite de ${limitType} pour ce mois`);
        return false;
      }
    }
    return true;
  };

  const incrementUsage = async (limitType: keyof PlanLimits) => {
    if (!user?.id) return;

    try {
      const currentUsage = usageStats[limitType] || 0;
      if (!checkLimit(limitType, currentUsage)) return false;

      const { error } = await supabase.rpc('increment_usage_stat', {
        p_user_id: user.id,
        p_stat_type: limitType
      });

      if (error) throw error;

      // Update local state
      setUsageStats(prev => ({
        ...prev,
        [limitType]: (prev[limitType] || 0) + 1
      }));

      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const resetUsage = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('usage_stats')
        .upsert({
          user_id: user.id,
          aiquestions: 0,
          exercisesperday: 0,
          last_reset: new Date().toISOString()
        });

      if (error) throw error;

      // Refresh stats
      fetchSubscription();
      fetchUsageStats();
    } catch (error) {
      console.error('Error resetting usage:', error);
    }
  }, [user?.id, fetchSubscription, fetchUsageStats]);

  return {
    subscription,
    loading,
    usageStats,
    getCurrentPlan,
    checkLimit,
    incrementUsage,
    resetUsage
  };
};