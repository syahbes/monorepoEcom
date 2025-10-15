import { Hono } from 'hono';
import Stripe from 'stripe';
import stripe from '../utils/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.post('/stripe', async (c) => {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (error) {
    console.log('Webhook verification failed!', error);
    return c.json({ error: 'Webhook verification failed!' }, 400);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      // TODO: CREATE ORDER
      console.log("WEBHOOK RECIVED", session)

      break;

    default:
      break;
  }
  return c.json({ recived: true });
});


export default webhookRoute;
