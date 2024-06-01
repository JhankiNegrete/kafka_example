### Manual de Implementación de Kafka en un Proyecto Node.js

Este manual indica la configuración e implementación de Kafka en un proyecto Node.js utilizando la librería `kafkajs`, teniendo en cuenta el montaje de dos contenedores usando docker y compose, definiendo el fichero `docker-compose.yml` para utilizar las imágenes de Bitnami para Zookeeper y Kafka.

---

## Contenido

1. [Requisitos](#requisitos)
2. [Configuración de Docker](#configuración-de-docker)
3. [Configuración del Proyecto Node.js](#configuración-del-proyecto-nodejs)
4. [Creación de un Productor Kafka](#creación-de-un-productor-kafka)
5. [Creación de un Consumidor Kafka](#creación-de-un-consumidor-kafka)
6. [Conclusión](#conclusión)

---

## Requisitos

- Node.js (versión 14 o superior)
- Docker y Docker Compose
- Un proyecto Node.js configurado

## Configuración de Docker

1. **Crear un archivo `docker-compose.yml`** con el siguiente contenido:

   ```yaml
   version: "3"
   services:
     zookeeper:
       image: bitnami/zookeeper:latest
       environment:
         - ALLOW_ANONYMOUS_LOGIN=yes
       ports:
         - "2181:2181"
     kafka:
       image: bitnami/kafka:latest
       ports:
         - "9092:9092"
       environment:
         - KAFKA_BROKER_ID=1
         - KAFKA_LISTENERS=PLAINTEXT://:9092
         - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
         - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
   ```

2. **Iniciar los contenedores**:

   ```sh
   docker-compose up -d
   ```

   Este comando iniciará los contenedores de Zookeeper y Kafka utilizando las imágenes de Bitnami.

## Configuración del Proyecto Node.js

1. **Crear un nuevo proyecto Node.js**:

   ```sh
   mkdir kafka-nodejs-project
   cd kafka-nodejs-project
   npm init -y
   ```

2. **Instalar la librería `kafkajs`**:

   ```sh
   npm install kafkajs
   ```

## Creación de un Consumidor Kafka

1. **Crear el archivo `consumer.js`**:

   ```javascript
   const { Kafka } = require("kafkajs");

   const kafka = new Kafka({
     clientId: "my-app",
     brokers: ["localhost:9092"],
   });

   const consumer = kafka.consumer({ groupId: "test-group" });

   const run = async () => {
     await consumer.connect();
     await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
     await consumer.run({
       eachMessage: async ({ partition, message }) => {
         console.log({
           partition,
           offset: message.offset,
           value: message.value.toString(),
         });
       },
     });
   };

   run().catch(console.error);
   ```

2. **Ejecutar el consumidor**:

   ```sh
   node consumer.js
   ```

## Creación de un Productor Kafka

1. **Crear el archivo `producer.js`**:

   ```javascript
   const { Kafka } = require("kafkajs");

   const kafka = new Kafka({
     clientId: "my-app",
     brokers: ["localhost:9092"],
   });

   const producer = kafka.producer();

   const run = async () => {
     await producer.connect();
     await producer.send({
       topic: "test-topic",
       messages: [{ value: "Hello KafkaJS user!" }],
     });
     await producer.disconnect();
   };

   run().catch(console.error);
   ```

2. **Ejecutar el productor**:

   ```sh
   node producer.js
   ```

## Conclusión

Este manual cubre los pasos necesarios para configurar y utilizar Apache Kafka en un proyecto Node.js utilizando la librería `kafkajs` y Docker Compose con imágenes de Bitnami. integrar Kafka ayuda a manejar flujos de datos en tiempo real de manera eficiente.

**Developed by Jhan Carlos Negrete**
