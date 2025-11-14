const request = require('supertest');
const app = require('../../src/app');

describe('System test: entire API', () => {
  test('health endpoint works', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
