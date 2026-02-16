import { supabase } from './supabase';

const STRIPE_PRICES = {
  pro: 'price_1T1YpaROvfVm88dkZMPbc7K0',
  autonomos: 'price_1T1YpaROvfVm88dk5PCShNql',
} as const;

/**
 * Create a Stripe Checkout session via Supabase Edge Function.
 * Redirects the user to Stripe's hosted checkout page.
 */
export async function createCheckoutSession(plan: 'pro' | 'autonomos') {
  const priceId = STRIPE_PRICES[plan];

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  // Call our Supabase Edge Function to create a checkout session
  const { data, error } = await supabase.functions.invoke('luca-checkout', {
    body: {
      priceId,
      plan,
      returnUrl: window.location.origin,
    },
  });

  if (error) throw error;
  if (data?.url) {
    window.location.href = data.url;
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions.
 */
export async function createPortalSession() {
  const { data, error } = await supabase.functions.invoke('luca-portal', {
    body: { returnUrl: window.location.origin },
  });

  if (error) throw error;
  if (data?.url) {
    window.location.href = data.url;
  }
}

export { STRIPE_PRICES };
