import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const SUBSCRIPTION_PLANS = {
  DECOUVERTE: {
    id: 'prod_RLUxFiEhpWFUe3',
    priceId: import.meta.env.VITE_STRIPE_DECOUVERTE_PRICE_ID,
    limits: {
      aiQuestions: 10,
      storage: 100, // MB
      exercisesPerDay: 5,
      revisionCards: 'basic',
      support: 'email',
      courses: 'standard'
    }
  },
  EXCELLENCE: {
    id: 'prod_RLUy4X6wTnacEo',
    priceId: import.meta.env.VITE_STRIPE_EXCELLENCE_PRICE_ID,
    limits: {
      aiQuestions: 100,
      storage: 1024, // MB (1 Go)
      exercisesPerDay: 20,
      revisionCards: 'advanced',
      support: 'priority',
      courses: 'premium'
    }
  },
  ELITE: {
    id: 'prod_RLUy078yfiXSr2',
    priceId: import.meta.env.VITE_STRIPE_ELITE_PRICE_ID,
    limits: {
      aiQuestions: -1, // illimité
      storage: 5120, // MB (5 Go)
      exercisesPerDay: -1, // illimité
      revisionCards: 'premium',
      support: '24/7',
      courses: 'all'
    }
  }
};

export const WEBHOOK_URL = 'https://sqzeotgydzwvofebxcgw.supabase.co/functions/v1/stripe-webhook';