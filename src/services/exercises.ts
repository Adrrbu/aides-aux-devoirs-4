import { supabase } from '../lib/supabase';
import { generateResponse } from '../lib/openai';
import toast from 'react-hot-toast';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  content: any;
  difficulty_level: string;
  subject_name?: string;
  topic_name?: string;
  best_score?: number;
  created_at?: string;
}

export const generateExercise = async (
  subject: string,
  topic: string,
  level: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Get subject ID
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .select('id')
      .eq('name', subject)
      .single();

    if (subjectError) {
      console.error('Error getting subject:', subjectError);
      throw new Error('Matière non trouvée');
    }

    // Get topic ID if provided
    let topicId = null;
    if (topic) {
      const { data: topicData, error: topicError } = await supabase
        .from('subject_topics')
        .select('id')
        .eq('subject_id', subjectData.id)
        .eq('name', topic)
        .single();

      if (!topicError && topicData) {
        topicId = topicData.id;
      } else {
        // Create new topic if it doesn't exist
        const { data: newTopic, error: createError } = await supabase
          .from('subject_topics')
          .insert({
            subject_id: subjectData.id,
            name: topic,
            description: `Thème de ${subject}`
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating topic:', createError);
          throw new Error('Erreur lors de la création du thème');
        }

        topicId = newTopic.id;
      }
    }

    // Generate exercise with AI
    const prompt = `Génère un exercice de ${subject} sur le thème "${topic}" pour un niveau ${level}. 
    L'exercice doit être adapté au niveau scolaire et inclure des questions progressives.`;
    
    const response = await generateResponse(prompt, 'quiz');
    
    if (typeof response === 'string') {
      throw new Error('Format de réponse invalide');
    }

    // Create exercise in database
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

    if (insertError) {
      console.error('Error creating exercise:', insertError);
      throw new Error('Erreur lors de la création de l\'exercice');
    }

    toast.success('Exercice généré avec succès');
    return exercise;
  } catch (error: any) {
    console.error('Error generating exercise:', error);
    toast.error(error.message || 'Erreur lors de la génération de l\'exercice');
    throw error;
  }
};

export const getExercises = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const { data, error } = await supabase
      .rpc('get_user_exercises', {
        p_user_id: user.id
      });

    if (error) {
      console.error('Error getting exercises:', error);
      throw new Error('Erreur lors de la récupération des exercices');
    }

    return data || [];
  } catch (error: any) {
    console.error('Error getting exercises:', error);
    toast.error(error.message || 'Erreur lors de la récupération des exercices');
    throw error;
  }
};