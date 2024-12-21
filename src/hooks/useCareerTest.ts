import { useState } from 'react';
import { generateResponse } from '../lib/openai';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useCareerTest = () => {
  const [currentTest, setCurrentTest] = useState<'personality' | 'aptitude' | 'interests' | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleTestComplete = async () => {
    if (!currentTest) return;

    try {
      setIsAnalyzing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const testType = currentTest === 'personality' ? 'RIASEC' : 
                      currentTest === 'aptitude' ? 'aptitudes' : 'intérêts';
      
      const prompt = `Analyse détaillée des résultats du test ${testType}. 
      Réponses: ${JSON.stringify(answers)}
      
      Pour chaque catégorie :
      1. Évalue les points forts
      2. Identifie les domaines de développement
      3. Suggère des orientations professionnelles précises
      4. Propose des formations recommandées
      5. Indique des compétences à développer
      
      Fournis une analyse approfondie et personnalisée.`;
      
      const response = await generateResponse(prompt, 'course');
      
      // Save test results
      const { error: saveError } = await supabase.rpc('save_test_results', {
        p_user_id: user.id,
        p_test_type: currentTest,
        p_answers: answers,
        p_analysis: response
      });

      if (saveError) throw saveError;

      setResults(response as string);
    } catch (error) {
      console.error('Error analyzing results:', error);
      toast.error('Erreur lors de l\'analyse des résultats');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setAnswers({});
    setResults(null);
    setIsAnalyzing(false);
  };

  return {
    currentTest,
    answers,
    results,
    isAnalyzing,
    setCurrentTest,
    handleAnswer,
    handleTestComplete,
    resetTest
  };
};