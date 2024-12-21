export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  } | null;
  error?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  has_completed_onboarding: boolean;
  created_at: string;
  updated_at: string;
}