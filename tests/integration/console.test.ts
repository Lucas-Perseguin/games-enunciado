import supertest from 'supertest';
import app from '@/app';
import httpStatus from 'http-status';
import { createConsole } from '../factories/consoles.factory';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe('POST /consoles', () => {
  it('should respond with status 422 if request body is in the worng format', async () => {
    const result = await api.post('/consoles').send({ number: 2 });

    expect(result.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('Should respond with status 409 if a console with the specified name already exists', async () => {
    const console = await createConsole();
    const result = await api.post('/consoles').send({ name: console.name });

    expect(result.status).toEqual(httpStatus.CONFLICT);
  });

  it('Should respond with status 201', async () => {
    const result = await api
      .post('/consoles')
      .send({ name: faker.name.fullName() });

    expect(result.status).toEqual(201);
  });
});

describe('GET /consoles', () => {
  it('Should respond with status 200 and an empty array if there are no consoles', async () => {
    const result = await api.get('/consoles');

    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body).toHaveLength(0);
  });

  it('Should respond with status 200 and all the consoles', async () => {
    await createConsole();
    const result = await api.get('/consoles');

    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body).toEqual(
      expect.not.arrayContaining([
        expect.not.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ])
    );
  });
});

describe('GET /consoles/:consoleId', () => {
  it('Should respond with status 404 if there is no console with the specified id', async () => {
    const result = await api.get('/consoles/1');

    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('Should respond with status 200 and the console', async () => {
    const console = await createConsole();
    const result = await api.get(`/consoles/${console.id}`);

    expect(result.status).toEqual(httpStatus.OK);
    expect(result.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      })
    );
  });
});
