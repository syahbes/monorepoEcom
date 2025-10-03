import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

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
