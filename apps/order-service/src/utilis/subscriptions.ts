import { consumer } from './kafka';
import { createOrder } from './orders';

export const runKafkaSubscriptions = async () => {
  consumer.subscribe('payment.successful', async (message) => {
    console.log('Received message: payment.successful', message);

    const order = message.value;
    await createOrder(order);
  });
};
