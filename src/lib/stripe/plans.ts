import { SubscriptionPlanConfig } from '../../types/subscription';

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlanConfig> = {
  DECOUVERTE: {
    id: 'decouverte',
    name: 'Découverte',
    description: 'Idéal pour commencer',
    priceId: import.meta.env.VITE_STRIPE_DECOUVERTE_PRICE_ID,
    price: 19.99,
    interval: 'month',
    limits: {
      aiquestions: 50,
      storage: 500,
      exercisesperday: 20,
      revisioncards: 'advanced',
      support: 'priority',
      courses: 'premium',
      tutoring: 'group',
      analytics: 'basic'
    },
    features: [
      'Accès aux cours premium',
      '20 exercices par jour',
      'Support prioritaire',
      'Cartes de révision avancées',
      'Sessions de tutorat en groupe',
      '50 questions IA par mois'
    ]
  },
  EXCELLENCE: {
    id: 'excellence',
    name: 'Excellence',
    description: 'Pour les étudiants ambitieux',
    priceId: import.meta.env.VITE_STRIPE_EXCELLENCE_PRICE_ID,
    price: 49.99,
    interval: 'month',
    limits: {
      aiquestions: 200,
      storage: 2000,
      exercisesperday: -1,
      revisioncards: 'premium',
      support: 'priority',
      courses: 'all',
      tutoring: 'group',
      analytics: 'advanced'
    },
    features: [
      'Accès à tous les cours',
      'Exercices illimités',
      'Support prioritaire',
      'Cartes de révision premium',
      'Sessions de tutorat en groupe illimitées',
      'Analyses de performance avancées',
      '200 questions IA par mois'
    ]
  },
  ELITE: {
    id: 'elite',
    name: 'Élite',
    description: 'L\'accompagnement ultime vers la réussite',
    priceId: import.meta.env.VITE_STRIPE_ELITE_PRICE_ID,
    price: 99.99,
    interval: 'month',
    limits: {
      aiquestions: -1,
      storage: -1,
      exercisesperday: -1,
      revisioncards: 'premium',
      support: '24/7',
      courses: 'all',
      tutoring: 'individual',
      analytics: 'premium'
    },
    features: [
      'Accès à tous les cours',
      'Exercices illimités',
      'Support 24/7',
      'Cartes de révision premium',
      'Sessions de tutorat individuelles',
      'Analyses de performance premium',
      'Questions IA illimitées',
      'Stockage illimité'
    ]
  }
};