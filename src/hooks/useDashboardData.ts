import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockAuth } from '../lib/auth/mockAuth';

interface DashboardData {
  progressData: Array<{
    subject: string;
    progress: number;
  }>;
  upcomingCourses: Array<{
    id: string;
    title: string;
    start_time: string;
  }>;
  statistics: {
    monthlyProgress: number;
    completedExercises: number;
  };
}

// Données simulées pour le développement
const MOCK_DATA: DashboardData = {
  progressData: [
    { subject: 'Mathématiques', progress: 75 },
    { subject: 'Français', progress: 80 },
    { subject: 'Histoire', progress: 65 },
    { subject: 'Anglais', progress: 70 }
  ],
  upcomingCourses: [
    {
      id: '1',
      title: 'Cours de mathématiques',
      start_time: new Date(Date.now() + 86400000).toISOString()
    }
  ],
  statistics: {
    monthlyProgress: 15,
    completedExercises: 27
  }
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      
      if (import.meta.env.DEV) {
        console.log('Using mock data in development');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setData(MOCK_DATA);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Load real data from Supabase...
      // (rest of the existing loadDashboardData code)

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh: loadDashboardData };
};