import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const usePinSetup = () => {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(true);

  const checkPinSetup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: wallet } = await supabase
        .from('wallets')
        .select('parent_pin')
        .eq('user_id', user.id)
        .single();

      const pinNeeded = !wallet?.parent_pin;
      setNeedsSetup(pinNeeded);
      setShowNotification(pinNeeded);
    } catch (error) {
      console.error('Error checking PIN setup:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPinSetup();

    const channel = supabase
      .channel('wallet_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets'
        },
        () => {
          checkPinSetup();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const hideNotification = () => {
    setShowNotification(false);
  };

  return {
    needsSetup,
    loading,
    showNotification,
    hideNotification,
    refreshPinSetup: checkPinSetup
  };
};