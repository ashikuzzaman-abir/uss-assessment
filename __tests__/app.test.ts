import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';

const root = `http://localhost`;
const port = process.env.PORT || 5000;
const app = `${root}:${port}`;

describe('MAIN APP TEST', () => {
  test('root route', async () => {
    const res = await request(app).get('/');
    expect(res.text).toEqual('Hello, Node.js!');
    expect(res.status).toEqual(200);
  });

  test('info route', async () => {
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

  test('404 route', async () => {
    const res = await request(app).get('/api/404');
    expect(res.status).toEqual(404);
  });
});
