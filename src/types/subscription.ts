export type SubscriptionPlan = 'DECOUVERTE' | 'EXCELLENCE' | 'ELITE';

export interface PlanLimits {
  aiquestions: number;
  storage: number;
  exercisesperday: number;
  revisioncards: 'basic' | 'advanced' | 'premium';
  support: 'email' | 'priority' | '24/7';
  courses: 'standard' | 'premium' | 'all';
  tutoring: 'none' | 'group' | 'individual';
  analytics: 'basic' | 'advanced' | 'premium';
}

export interface SubscriptionPlanConfig {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  interval: 'month' | 'year';
  limits: PlanLimits;
  features: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
}

export interface UserSubscriptionRole {
  role: SubscriptionPlan;
  permissions: {
    canAccessPremiumCourses: boolean;
    canAccessAdvancedAnalytics: boolean;
    canAccessTutoring: boolean;
    canAccessPremiumSupport: boolean;
  };
}