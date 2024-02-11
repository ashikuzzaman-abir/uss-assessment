import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { faker } from '@faker-js/faker';

const root = `http://localhost`;
const port = process.env.PORT || 5000;
const app = `${root}:${port}`;

describe('MAIN APP TEST', () => {
  test('root route - /', async () => {
    const res = await request(app).get('/');
    expect(res.text).toEqual('Hello, Node.js!');
    expect(res.status).toEqual(200);
  });

  test('info route - /api/info', async () => {
    const res = await request(app).get('/api/info');
    expect(res.body).toEqual({
      name: 'Md. Ashikuzzaman Abir',
      designation: 'Software Engineer',
      company: 'Thinkcrypt.io',
      github: 'https://github.com/ashikuzzaman-abir',
      email: 'ashikuzzamanabir@hotmail.com',
    });
    expect(res.status).toEqual(200);
  });

  test('404 route - /api/404', async () => {
    const res = await request(app).get('/api/404');
    expect(res.status).toEqual(404);
  });
});

describe('Register User - /api/register', () => {
  test('Expecting 400 for wrong data', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Md. Ashikuzzaman Abir',
        email: 'ashikuzzamanabir@hotmail.com',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });
  test('Expecting 201 for random faker data', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(201);
    //deleting the user after creating
    if (res.status === 201) {
      const deleteResponse = await request(app).delete(
        '/api/user/' + res.body.user._id
      );
      expect(deleteResponse.status).toEqual(200);
    }
  });
});

describe('Login User - /api/login', () => {
  test('Expecting 400 for wrong data', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: '',
        password: '',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });
  test('Expecting 200 for random faker data', async () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        username,
        email,
        password,
      })
      .set('Accept', 'application/json');

    if (registerRes.status === 201) {
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          username,
          password,
        })
        .set('Accept', 'application/json');
      expect(loginRes.status).toEqual(200);

      //deleting the user after creating
      const deleteResponse = await request(app).delete(
        '/api/user/' + registerRes.body.user._id
      );
    }
  });
  test('Expecting Token when login finish', async () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        username,
        email,
        password,
      })
      .set('Accept', 'application/json');

    if (registerRes.status === 201) {
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          username,
          password,
        })
        .set('Accept', 'application/json');
      expect(loginRes.status).toEqual(200);
      expect(loginRes.body.token).toBeTruthy();

      //deleting the user after creating
      const deleteResponse = await request(app).delete(
        '/api/user/' + registerRes.body.user._id
      );
    }
  });
});

describe('Protected Routes - /api/users/me', () => {
  test('Expecting 401 for unauthorized access', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toEqual(401);
  });
  test('Expecting 200 for authorized access', async () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const registerRes = await request(app)
      .post('/api/register')
      .send({
        username,
        email,
        password
      })
      .set('Accept', 'application/json');

    if (registerRes.status === 201) {
      const loginRes = await request(app)
        .post('/api/login')
        .send({
          username,
          password
        })
        .set('Accept', 'application/json');
      expect(loginRes.status).toEqual(200);
      expect(loginRes.body.token).toBeTruthy();

      const protectedRes = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${loginRes.body.token}`);
      expect(protectedRes.status).toEqual(200);

      //deleting the user after creating
      const deleteResponse = await request(app).delete(
        '/api/user/' + registerRes.body.user._id
      );
    }
  });
});
