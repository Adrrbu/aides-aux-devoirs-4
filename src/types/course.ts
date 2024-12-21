export interface Course {
  id: string;
  title: string;
  subject_name: string;
  topic_name?: string;
  description?: string;
  content: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
}