import { loadStripe } from '@stripe/stripe-js';
import { SUBSCRIPTION_PLANS } from './plans';
import { SubscriptionPlan } from '../../types/subscription';
import { supabase } from '../supabase/client';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key');
}

// Initialize Stripe
export const stripe = loadStripe(STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (planId: SubscriptionPlan, userId: string) => {
  try {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan || planId === 'DECOUVERTE') return;

    // Instead of using Supabase Functions, use Stripe Checkout directly
    const stripeInstance = await stripe;
    if (!stripeInstance) throw new Error('Stripe not initialized');

    const session = await stripeInstance.redirectToCheckout({
      mode: 'subscription',
      lineItems: [{ price: plan.priceId, quantity: 1 }],
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/canceled`,
      clientReferenceId: userId,
    });

    if (session.error) throw session.error;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, newPlanId: SubscriptionPlan) => {
  try {
    const plan = SUBSCRIPTION_PLANS[newPlanId];
    if (!plan || newPlanId === 'DECOUVERTE') return;

    const { error } = await supabase.functions.invoke('update-subscription', {
      body: {
        subscriptionId,
        newPriceId: plan.priceId
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Add a free subscription by default when a user signs up
export const createFreeSubscription = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: 'DECOUVERTE',
        status: 'active',
        current_period_end: '9999-12-31T23:59:59Z',
        cancel_at_period_end: false
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating free subscription:', error);
    throw error;
  }
};
