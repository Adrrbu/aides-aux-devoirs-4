import { supabase } from '../supabase';
import { retry } from '../utils/retry';
import { getStoredSession } from './storage';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const getSession = async () => {
  try {
    // Vérifier d'abord la session stockée localement
    const storedSession = getStoredSession();
    if (storedSession?.access_token && storedSession?.refresh_token) {
      const { data: { session }, error } = await supabase.auth.setSession({
        access_token: storedSession.access_token,
        refresh_token: storedSession.refresh_token
      });
      
      if (!error && session) {
        return session;
      }
    }

    // Si pas de session stockée ou invalide, récupérer la session active
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const refreshSession = async () => {
  try {
    const currentSession = await getSession();
    if (!currentSession?.refresh_token) {
      return null;
    }

    const { data: { session }, error } = await retry(
      async () => await supabase.auth.refreshSession(),
      MAX_RETRIES,
      RETRY_DELAY
    );

    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
};

export const setupAuthListener = (onAuthStateChange: (session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event);
    
    if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
      onAuthStateChange(session);
    } else if (event === 'SIGNED_OUT') {
      onAuthStateChange(null);
    } else if (event === 'USER_UPDATED') {
      // Rafraîchir la session quand l'utilisateur est mis à jour
      const refreshedSession = await refreshSession();
      onAuthStateChange(refreshedSession);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
};

export const initializeAuth = async () => {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    // Vérifier si le token est proche de l'expiration
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (expiresAt && (expiresAt.getTime() - now.getTime()) < fiveMinutes) {
      return await refreshSession();
    }

    return session;
  } catch (error) {
    console.error('Error initializing auth:', error);
    return null;
  }
};