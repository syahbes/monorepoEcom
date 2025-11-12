import { consumer } from './kafka';
import { createStripeProduct, deleteStripeProduc } from './stripeProduct';

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: 'product.created',
      topicHandler: async (message) => {
        const product = message.value;
        console.log('Recived message: product.created', product);

        await createStripeProduct(product);
      },
    },
    {
      topicName: 'product.deleted',
      topicHandler: async (message) => {
        const productId = message.value;
        console.log('Recived message: product.deleted', productId);

        await deleteStripeProduc(productId);
      },
    }
  ])
};