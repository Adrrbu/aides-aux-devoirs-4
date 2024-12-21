import { LucideIcon } from 'lucide-react';

export interface OnboardingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface OnboardingStep {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features?: OnboardingFeature[];
}