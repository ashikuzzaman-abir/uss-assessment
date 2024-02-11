import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';



describe('Test app.ts', () => {
  
  test('root route', async () => {
    const res = await request('http://localhost:5000').get('/');
    expect(res.text).toEqual('Hello, Node.js!');
  });
});
