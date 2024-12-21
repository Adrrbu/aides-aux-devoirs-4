import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase/client';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      // En développement, on utilise l'authentification simulée
      if (import.meta.env.DEV) {
        const mockUser = localStorage.getItem('mockUser');
        setIsAuthenticated(!!mockUser);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </>
  );
}

export default App;