import Fastify from 'fastify';
import Clerk from '@clerk/fastify';
import { shouldBeUser } from './middleware/authMiddleware.js';
import { connectOrderDB } from '@repo/order-db';
import { orderRoute } from './routes/order.js';
import { consumer, producer } from './utilis/kafka.js';

const fastify = Fastify();

fastify.register(Clerk.clerkPlugin);

fastify.get('/health', (request, reply) => {
  return reply.status(200).send({
    status: 'ok',
    uptime: process.uptime(),
    timstamp: Date.now(),
  });
});

fastify.get('/test', { preHandler: shouldBeUser }, (request, reply) => {
  return reply.send({ message: 'Order service is authenticated!', userId: request.userId });
});

fastify.register(orderRoute);

const start = async () => {
  try {
    Promise.all([await connectOrderDB(), await producer.connect(), await consumer.connect()]);
    await fastify.listen({ port: 8001 });
    console.log('Order service is running on port 8001');
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
