import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

export function buildApp() {
  const prisma = new PrismaClient();
  const server = fastify();

  server.get('/ping', async (_, reply) => {
    try {
      await prisma.counter.create({
        data: {},
      });

      const count = await prisma.counter.count();

      return reply.status(200).send({ count });
    } catch (error: any) {
      return reply.status(500).send({ error: error?.message });
    }
  });

  return server;
}
