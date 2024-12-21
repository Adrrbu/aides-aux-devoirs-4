export interface Feedback {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  attachment_urls?: string[];
  created_at: string;
  updated_at: string;
}