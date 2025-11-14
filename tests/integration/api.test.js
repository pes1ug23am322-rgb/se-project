const request = require('supertest');
const app = require('../../src/app');
const services = require('../../src/services');

describe('POST /convert', () => {
  beforeAll(() => {
    jest.spyOn(services, 'fetchBlog').mockResolvedValue('<html><body>Hello</body></html>');
    jest.spyOn(services, 'cleanHtml').mockReturnValue('Hello');
  });

  test('returns cleaned output', async () => {
    const res = await request(app)
      .post('/convert')
      .send({ url: 'https://test.com' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.cleanedLength).toBeGreaterThan(0);
  });

  test('rejects missing url', async () => {
    const res = await request(app).post('/convert').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('url required');
  });
});
