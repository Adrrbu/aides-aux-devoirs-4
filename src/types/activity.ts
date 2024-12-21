export type ActivityType = 'exercise' | 'course' | 'revision' | 'transaction';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  score?: number;
  description?: string;
  amount?: number;
  transactionType?: 'credit' | 'debit';
}