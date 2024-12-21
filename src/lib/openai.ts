import OpenAI from 'openai';
import { QuizContent } from './types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface QuizQuestion {
  question: string;
  choices: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
  explanation: string;
}

const getSystemPrompt = (type: 'course' | 'revision' | 'quiz') => {
  switch (type) {
    case 'course':
      return `Tu es un professeur expert qui crée des cours détaillés et structurés.
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
      - Mets en évidence les concepts importants en gras`;
    
    case 'revision':
      return `Tu es un expert en pédagogie qui crée des fiches de révision efficaces.
      Format attendu:
      - Structure claire avec des sections distinctes
      - Points clés en gras
      - Utilise des listes à puces pour faciliter la mémorisation
      - Inclus des exemples pratiques
      - Pour les formules mathématiques:
        * Utilise \\sqrt{x} pour les racines carrées
        * Utilise ^2 pour les exposants
        * Utilise \\frac{num}{den} pour les fractions`;
    
    case 'quiz':
      return `Tu es un créateur de quiz pédagogiques.
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
      }`;
  }
};

const formatMathContent = (content: string): string => {
  return content
    .replace(/\\sqrt\{([^}]+)\}/g, '<span class="math">√($1)</span>')
    .replace(/\^2/g, '<sup>2</sup>')
    .replace(/\^([0-9])/g, '<sup>$1</sup>')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>');
};

const formatCourseContent = (content: string): string => {
  // Format math expressions first
  content = formatMathContent(content);

  // Format general content
  return `
    <div class="prose max-w-none">
      ${content
        .replace(/\*\*(.*?)\*\*/g, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-4">$1</h2>')
        .replace(/\*(.*?)\*/g, '<em class="text-gray-800">$1</em>')
        .replace(/\n\n/g, '</p><p class="mb-4 text-base leading-relaxed text-gray-700">')
        .replace(/^- (.*)/gm, '<li class="ml-4 mb-2 text-gray-700">$1</li>')
        .replace(/<li/g, '<ul class="list-disc mb-4"><li')
        .replace(/li>\n/g, 'li></ul>\n')
        .replace(/^(\d+)\. (.*)/gm, '<li class="ml-4 mb-2 text-gray-700">$2</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>')}
    </div>
    <style>
      .math {
        font-family: 'Times New Roman', serif;
        font-style: italic;
      }
      .fraction {
        display: inline-block;
        vertical-align: middle;
        margin: 0 0.2em;
        text-align: center;
      }
      .numerator, .denominator {
        display: block;
        padding: 0.1em;
      }
      .numerator {
        border-bottom: 1px solid currentColor;
      }
    </style>
  `;
};

export const generateResponse = async (
  message: string,
  type: 'course' | 'revision' | 'quiz' = 'course'
): Promise<string | QuizContent> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: getSystemPrompt(type) },
        { role: "user", content: message }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 3000,
      response_format: type === 'quiz' ? { type: "json_object" } : { type: "text" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("Réponse invalide de l'API");
    }

    if (type === 'quiz') {
      return formatQuizResponse(response);
    }

    return formatCourseContent(response);
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw new Error(error.message || "Une erreur est survenue lors de la génération de la réponse");
  }
};

const formatQuizResponse = (response: string): QuizContent => {
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

export type { QuizContent, QuizQuestion };