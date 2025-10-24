import type { Kafka, Consumer } from 'kafkajs';

export const createConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId });

  const connect = async () => {
    await consumer.connect();
    console.log('Kafka consumer conncted:' + groupId);
  };

  const subscribe = async (topic: string, handler: (message: any) => Promise<void>) => {
    await consumer.subscribe({
      topic: topic,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString();

          if (value) {
            await handler(JSON.parse(value));
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const disconnect = async () => {
    await consumer.disconnect();
  };

  return { connect, subscribe, disconnect };
};
