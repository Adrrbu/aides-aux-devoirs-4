import { ContentType } from './types';
import { supabase } from '../supabase';

const getLearningDifficulties = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('users')
      .select('learning_difficulties')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data?.learning_difficulties || [];
  } catch (error) {
    console.error('Error getting learning difficulties:', error);
    return [];
  }
};

const getAdaptedInstructions = (difficulties: string[]): string => {
  const adaptations = [];

  if (difficulties.includes('dyslexia')) {
    adaptations.push(`
      - Utiliser des phrases courtes et claires
      - Éviter les mots complexes
      - Structurer le texte avec des listes et des points clés
      - Ajouter des repères visuels
    `);
  }

  if (difficulties.includes('dyscalculia')) {
    adaptations.push(`
      - Décomposer les problèmes mathématiques en étapes simples
      - Utiliser des représentations visuelles pour les concepts mathématiques
      - Expliquer chaque étape de calcul en détail
      - Fournir des exemples concrets
    `);
  }

  if (difficulties.includes('dysorthographia')) {
    adaptations.push(`
      - Mettre en évidence les règles grammaticales importantes
      - Utiliser des moyens mnémotechniques
      - Répéter les concepts clés
    `);
  }

  if (difficulties.includes('dysgraphia')) {
    adaptations.push(`
      - Privilégier les formats numériques
      - Éviter les exercices nécessitant beaucoup d'écriture manuscrite
      - Proposer des alternatives pour la prise de notes
    `);
  }

  if (difficulties.includes('dyspraxia')) {
    adaptations.push(`
      - Simplifier les manipulations requises
      - Donner des instructions étape par étape
      - Proposer des alternatives aux tâches motrices complexes
    `);
  }

  if (difficulties.includes('dysphasia')) {
    adaptations.push(`
      - Utiliser un vocabulaire simple et précis
      - Accompagner les explications de supports visuels
      - Répéter les concepts importants de différentes manières
    `);
  }

  return adaptations.length > 0 
    ? "\n\nAdaptations spécifiques requises:\n" + adaptations.join("\n")
    : "";
};

export const getSystemPrompt = async (type: ContentType): Promise<string> => {
  const difficulties = await getLearningDifficulties();
  const adaptations = getAdaptedInstructions(difficulties);

  const basePrompts = {
    course: `Tu es un professeur expert qui crée des cours détaillés et structurés.
      Format attendu:
      - Utilise des titres principaux en gras (**Titre**)
      - Structure le contenu avec des sous-sections claires
      - Utilise des listes à puces pour les points clés
      - Inclus des exemples concrets
      - Pour les formules mathématiques:
        * Utilise \\sqrt{x} pour les racines carrées
        * Utilise ^2 pour les exposants
        * Utilise \\frac{num}{den} pour les fractions
      - Évite les symboles # pour les titres
      - Mets en évidence les concepts importants en gras${adaptations}`,
    
    revision: `Tu es un expert en pédagogie qui crée des fiches de révision efficaces.
      Format attendu:
      - Structure claire avec des sections distinctes
      - Points clés en gras
      - Utilise des listes à puces pour faciliter la mémorisation
      - Inclus des exemples pratiques
      - Pour les formules mathématiques:
        * Utilise \\sqrt{x} pour les racines carrées
        * Utilise ^2 pour les exposants
        * Utilise \\frac{num}{den} pour les fractions${adaptations}`,
    
    quiz: `Tu es un créateur de quiz pédagogiques.
      Format JSON attendu:
      {
        "title": "Titre du quiz",
        "questions": [
          {
            "question": "Question",
            "choices": [
              {"id": "a", "text": "Réponse A"},
              {"id": "b", "text": "Réponse B"},
              {"id": "c", "text": "Réponse C"},
              {"id": "d", "text": "Réponse D"}
            ],
            "correctAnswer": "a",
            "explanation": "Explication détaillée"
          }
        ]
      }
      
      Instructions spécifiques:
      - Crée 5 questions variées sur le sujet
      - Assure-toi que les questions sont progressives en difficulté
      - Fournis des explications détaillées pour chaque réponse
      - Adapte le niveau au contexte fourni
      - Inclus des questions pratiques et théoriques${adaptations}`
  };

  return basePrompts[type];
};