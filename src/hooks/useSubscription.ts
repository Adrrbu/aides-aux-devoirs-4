import { useState, useEffect, useCallback } from 'react';
import { SUBSCRIPTION_PLANS } from '../lib/stripe/plans';
import { PlanLimits, Subscription } from '../types/subscription';
import { supabase } from '../lib/supabase/client';
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
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSubscription(data);
      } else {
        // Create a free subscription if none exists
        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan_id: 'DECOUVERTE',
            status: 'active',
            current_period_end: '9999-12-31T23:59:59Z',
            cancel_at_period_end: false
          });
        
        setSubscription({
          id: 'decouverte',
          user_id: user.id,
          plan_id: 'DECOUVERTE',
          status: 'active',
          current_period_end: '9999-12-31T23:59:59Z',
          cancel_at_period_end: false
        });
      }
    } catch (error) {
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

      if (error) throw error;

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
    if (!user?.id) return false;

    try {
      const currentValue = usageStats[limitType] || 0;
      const newValue = currentValue + 1;

      const { error } = await supabase
        .from('usage_stats')
        .upsert({
          user_id: user.id,
          [limitType]: newValue,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setUsageStats(prev => ({
        ...prev,
        [limitType]: newValue
      }));

      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const refresh = useCallback(() => {
    fetchSubscription();
    fetchUsageStats();
  }, [fetchSubscription, fetchUsageStats]);

  return {
    subscription,
    loading,
    getCurrentPlan,
    checkLimit,
    incrementUsage,
    usageStats,
    refresh
  };
};