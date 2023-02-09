import { faker } from '@faker-js/faker';
import prisma from '@/config/database';
import { Game } from '@prisma/client';

export function createGame(consoleId: number): Promise<Game> {
  return prisma.game.create({
    data: {
      title: faker.name.fullName(),
      consoleId,
    },
  });
}
