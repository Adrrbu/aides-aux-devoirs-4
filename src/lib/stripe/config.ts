import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const WEBHOOK_URL = 'https://sqzeotgydzwvofebxcgw.supabase.co/functions/v1/stripe-webhook';