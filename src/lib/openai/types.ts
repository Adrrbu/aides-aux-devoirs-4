export interface QuizQuestion {
  question: string;
  choices: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
  explanation: string;
}

export interface QuizContent {
  title: string;
  questions: QuizQuestion[];
}

export type ContentType = 'course' | 'revision' | 'quiz';