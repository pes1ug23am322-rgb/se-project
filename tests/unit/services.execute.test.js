const { fetchBlog, cleanHtml } = require('../../src/services');

describe('execute real services.js for coverage', () => {
  test('fetchBlog returns sample HTML', async () => {
    const html = await fetchBlog('https://example.com');
    expect(html.includes('<html')).toBe(true);
  });

  test('cleanHtml removes tags', () => {
    const cleaned = cleanHtml('<p>Hi</p>');
    expect(cleaned).toBe('Hi');
  });
});
