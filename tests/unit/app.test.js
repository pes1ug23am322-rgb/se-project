const app = require('../../src/app');
const request = require('supertest');

describe('app file coverage booster', () => {
  test('loads app.js and triggers routes', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
