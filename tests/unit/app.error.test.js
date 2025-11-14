const app = require('../../src/app');
const request = require('supertest');

jest.mock('../../src/services', () => ({
  fetchBlog: jest.fn(),
  cleanHtml: jest.fn()
}));

const services = require('../../src/services');

describe('error branch coverage for app.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /convert triggers catch block when fetchBlog rejects', async () => {
    services.fetchBlog.mockRejectedValue(new Error('forced error'));

    const res = await request(app)
      .post('/convert')
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('conversion_failed');
  });
});

