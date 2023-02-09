import supertest from 'supertest';
import app from '@/app';
import httpStatus from 'http-status';
import { createConsole } from '../factories/consoles.factory';
import { createGame } from '../factories/games.factory';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';

const api = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe('GET /games', () => {
  it('Should respond with status 200 and all games data', async () => {
    const videoGame = await createConsole();
    const game = await createGame(videoGame.id);

    const response = await api.get('/games');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          consoleId: expect.any(Number),
        }),
      ])
    );
  });
});

describe('GET /games/:id', () => {
  it('Should respond with status 401 if when id is not valid', async () => {
    const response = await api.get('/games/0');

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond with status 200 when id is valid', async () => {
    const console = await createConsole();
    const game = await createGame(console.id);

    const response = await api.get(`/games/${game.id}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        consoleId: expect.any(Number),
      })
    );
  });
});

describe('POST /games', () => {
  it('Should respond with status 422 if fail in game schema', async () => {
    const body = {};

    const response = await api.post('/games').send(body);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('Should respond with status 201 and create the game', async () => {
    const videoGame = await createConsole();

    const response = await api.post('/games').send({
      title: faker.name.firstName(),
      consoleId: videoGame.id,
    });

    expect(response.status).toBe(httpStatus.CREATED);
  });
});
