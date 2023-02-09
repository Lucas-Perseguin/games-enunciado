import { faker } from '@faker-js/faker';
import prisma from '@/config/database';
import { Console } from '@prisma/client';

export function createConsole(): Promise<Console> {
  const body = {
    name: faker.name.fullName(),
  };
  return prisma.console.create({
    data: {
      name: body.name,
    },
  });
}
