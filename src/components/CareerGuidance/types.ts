export interface Question {
  id: string;
  text: string;
  category: string;
}

export interface Test {
  title: string;
  description: string;
  questions: Question[];
}