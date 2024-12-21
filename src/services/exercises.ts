import { supabase } from '../lib/supabase';
import { generateResponse } from '../lib/openai';
import toast from 'react-hot-toast';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  content: any;
  difficulty_level: string;
  subject_id: string;
  topic_id?: string;
}

export const generateExercise = async (
  subject: string,
  topic: string,
  level: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Récupérer l'ID de la matière
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .select('id')
      .eq('name', subject)
      .single();

    if (subjectError) throw subjectError;

    // Récupérer l'ID du thème si fourni
    let topicId = null;
    if (topic) {
      const { data: topicData, error: topicError } = await supabase
        .from('subject_topics')
        .select('id')
        .eq('subject_id', subjectData.id)
        .eq('name', topic)
        .single();

      if (!topicError) {
        topicId = topicData.id;
      }
    }

    // Générer l'exercice avec l'IA
    const prompt = `Génère un exercice de ${subject} sur le thème "${topic}" pour un niveau ${level}. 
    L'exercice doit être adapté au niveau scolaire et inclure des questions progressives.`;
    
    const response = await generateResponse(prompt, 'quiz');
    
    if (typeof response === 'string') {
      throw new Error('Format de réponse invalide');
    }

    // Créer l'exercice dans la base de données
    const { data: exercise, error: insertError } = await supabase
      .from('exercises')
      .insert([{
        user_id: user.id,
        subject_id: subjectData.id,
        topic_id: topicId,
        title: response.title,
        description: `Exercice de ${subject} - ${topic}`,
        content: response,
        difficulty_level: level,
        best_score: 0
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    toast.success('Exercice généré avec succès');
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
        subject:subject_id (name),
        topic:topic_id (name)
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