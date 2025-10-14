import { Hono } from 'hono';
import stripe from '../utils/stripe';
import { shouldBeUser } from '../middleware/authMiddleware';
import Stripe from 'stripe';
import { CartItemsType } from '@repo/types';
import { getStripeProductPrice } from '../utils/stripeProduct';

const sessionRoute = new Hono();

sessionRoute.post('/create-checkout-session', shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get('userId');

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      const unitAmount = await getStripeProductPrice(item.id);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount as number,
        },
        quantity: item.quantity,
      };
    })
  );

  try {
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      client_reference_id: userId,
      mode: 'payment',
      ui_mode: 'custom',
      return_url: 'http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add your supported countries
      },
    });

    return c.json({
      checkoutSessionClientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe session creation error:', error as string);
    return c.json({ error: error as string }, 500);
  }
});

sessionRoute.get('/:session_id', async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(session_id as string, {
    expand: ['line_items'],
  });

  console.log(session);
  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
