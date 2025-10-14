import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { clerkMiddleware } from '@hono/clerk-auth';
import sessionRoute from './routes/session.route.js';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', clerkMiddleware());
app.use('*', cors({ origin: ['http://localhost:3002'] }));

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timstamp: Date.now(),
  });
});

app.route('/sessions', sessionRoute);

/*
## just for testing , we will use Kafaka ##
app.post('/create-stripe-product', async (c) => {
  const res = await stripe.products.create({
    id: '123',
    name: 'Test Product',
    default_price_data: {
      currency: 'usd',
      unit_amount: 10 * 100,
    },
  });
  return c.json(res);
});

app.get('/stripe-product-list', async (c) => {
  const res = await stripe.prices.list({
    product: '123',
  });
  return c.json(res);
});
*/
const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log('Payment service is running on port 8002');
      }
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
