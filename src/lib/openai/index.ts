import { openai } from './config';
import { getSystemPrompt } from './prompts';
import { formatCourseContent } from './formatters/contentFormatter';
import { formatQuizResponse } from './formatters/quizFormatter';
import { ContentType, QuizContent } from './types';

export const generateResponse = async (
  message: string,
  type: ContentType = 'course'
): Promise<string | QuizContent> => {
  try {
    if (!message.trim()) {
      throw new Error("Le message ne peut pas être vide");
    }

    console.log('Generating response for:', { message, type });

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: getSystemPrompt(type) },
        { role: "user", content: message }
      ],
      model: "gpt-4-turbo-preview", // Utilisation de GPT-4
      temperature: 0.7,
      max_tokens: 3000,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("Réponse invalide de l'API");
    }

    console.log('Response received:', response);

    if (type === 'quiz') {
      return formatQuizResponse(response);
    }

    return formatCourseContent(response);
  } catch (error: any) {
    console.error('Error generating response:', error);
    if (error.response) {
      console.error('OpenAI API Error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw new Error(error.message || "Une erreur est survenue lors de la génération de la réponse");
  }
};

export * from './types';