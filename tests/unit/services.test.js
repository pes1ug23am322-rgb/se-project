const { cleanHtml } = require('../../src/services');

describe('cleanHtml', () => {
  test('removes HTML tags', () => {
    const result = cleanHtml('<p>Hello <b>World</b></p>');
    expect(result).toBe('Hello World');
  });

  test('returns empty string for empty input', () => {
    expect(cleanHtml('')).toBe('');
    expect(cleanHtml(null)).toBe('');
    expect(cleanHtml(undefined)).toBe('');
  });
});
