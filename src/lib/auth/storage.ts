const SESSION_KEY = 'aizily_auth';

export const clearAuthStorage = () => {
  try {
    // Supprimer toutes les données d'authentification
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('supabase.auth.token');
    
    // Supprimer les cookies liés à l'authentification
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('sb-') || name.includes('auth')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      }
    });
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};

export const getStoredSession = () => {
  try {
    // Vérifier d'abord localStorage
    let session = localStorage.getItem(SESSION_KEY);
    if (!session) {
      // Si pas dans localStorage, vérifier sessionStorage
      session = sessionStorage.getItem(SESSION_KEY);
    }
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting stored session:', error);
    return null;
  }
};

export const setStoredSession = (session: any) => {
  try {
    if (!session) {
      clearAuthStorage();
      return;
    }
    
    const sessionData = JSON.stringify(session);
    localStorage.setItem(SESSION_KEY, sessionData);
  } catch (error) {
    console.error('Error storing session:', error);
  }
};