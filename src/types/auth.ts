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