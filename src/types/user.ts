export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  school?: string | null;
  address?: string | null;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  fullName: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  school?: string | null;
  address?: string | null;
  hasCompletedOnboarding?: boolean;
}