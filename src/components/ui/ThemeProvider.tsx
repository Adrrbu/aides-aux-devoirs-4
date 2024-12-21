import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load theme from user preferences
    const loadTheme = async () => {
      try {
        // First try to load from localStorage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
          console.log('Loading theme from localStorage:', savedTheme);
          setTheme(savedTheme);
        }

        // Then try to load from user preferences
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', user.id)
            .single();

          if (profile?.preferences?.theme) {
            console.log('Loading theme from user preferences:', profile.preferences.theme);
            setTheme(profile.preferences.theme);
            localStorage.setItem('theme', profile.preferences.theme);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    // Apply theme to HTML element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = async () => {
    console.log('Toggling theme from:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Update state and localStorage immediately
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    console.log('Theme toggled to:', newTheme);

    try {
      // Save theme to user preferences
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('preferences')
          .eq('id', user.id)
          .single();

        const { error } = await supabase
          .from('users')
          .update({
            preferences: {
              ...profile?.preferences,
              theme: newTheme
            }
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error saving theme to user preferences:', error);
        } else {
          console.log('Theme saved to user preferences');
        }
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
