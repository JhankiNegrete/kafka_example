const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  // Conectar al productor
  await producer.connect();

  // Enviar un mensaje
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  });

  // Desconectar al productor
  await producer.disconnect();
};

run().catch(console.error);
