const app = require('../../src/app');
const request = require('supertest');

describe('branch coverage tests for app.js', () => {
  test('POST /convert with no url triggers error branch', async () => {
    const res = await request(app).post('/convert').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('url required');
  });
});
