import { supabase } from '../../../lib/supabase';
import { generateResponse } from '../../../lib/openai';
import { Exercise } from '../types';
import toast from 'react-hot-toast';

export const generateExercise = async (
  subject: string,
  topic: string,
  level: string
): Promise<Exercise> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data: subjectData } = await supabase
      .from('subjects')
      .select('id')
      .eq('name', subject)
      .single();

    if (!subjectData) throw new Error('Matière non trouvée');

    const prompt = `Génère un exercice de ${subject} sur le thème "${topic}" pour un niveau ${level}. 
    L'exercice doit être adapté au niveau scolaire et inclure des questions progressives.`;
    
    const response = await generateResponse(prompt, 'quiz');
    
    if (typeof response === 'string') {
      throw new Error('Format de réponse invalide');
    }

    const { data: exercise, error: insertError } = await supabase
      .from('exercises')
      .insert([{
        user_id: user.id,
        subject_id: subjectData.id,
        title: response.title,
        description: `Exercice de ${subject} - ${topic}`,
        content: response,
        difficulty_level: level
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return exercise;
  } catch (error: any) {
    console.error('Error generating exercise:', error);
    toast.error('Erreur lors de la génération de l\'exercice');
    throw error;
  }
};

export const getExercises = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
      .from('exercises')
      .select(`
        *,
        subject:subject_id (name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading exercises:', error);
    throw error;
  }
};