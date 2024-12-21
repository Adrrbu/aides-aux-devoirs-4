export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  question: string;
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
}

export interface QuestionResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Exercise {
  id?: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  questions: Question[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}