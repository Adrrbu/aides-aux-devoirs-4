import { QuizContent } from '../types';

export const formatQuizResponse = (response: string): QuizContent => {
  try {
    if (typeof response === 'object') {
      return response as QuizContent;
    }

    const parsedResponse = JSON.parse(response);
    
    const formattedQuestions = parsedResponse.questions.map((q: any) => ({
      question: q.question,
      choices: Array.isArray(q.choices) ? q.choices.map((c: any, index: number) => ({
        id: typeof c === 'object' ? c.id : String.fromCharCode(97 + index),
        text: typeof c === 'object' ? c.text : c
      })) : [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'Pas d\'explication disponible.'
    }));

    return {
      title: parsedResponse.title || 'Quiz',
      questions: formattedQuestions
    };
  } catch (error) {
    console.error('Error parsing quiz response:', error);
    throw new Error('Format de quiz invalide');
  }
};