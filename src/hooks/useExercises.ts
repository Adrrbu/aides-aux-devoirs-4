import { useState, useEffect } from 'react';
import { getExercises, generateExercise } from '../services/exercises';

export const useExercises = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises();
      setExercises(data || []);
      setError(null);
    } catch (error: any) {
      console.error('Error loading exercises:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async (subject: string, topic: string, level: string) => {
    try {
      const exercise = await generateExercise(subject, topic, level);
      setExercises(prev => [exercise, ...prev]);
      return exercise;
    } catch (error) {
      throw error;
    }
  };

  return {
    exercises,
    loading,
    error,
    refreshExercises: loadExercises,
    createExercise
  };
};