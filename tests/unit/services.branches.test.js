const { cleanHtml } = require('../../src/services');

describe('branch coverage for services.js', () => {
  test('cleanHtml handles null and undefined', () => {
    expect(cleanHtml('')).toBe('');
    expect(cleanHtml(null)).toBe('');
    expect(cleanHtml(undefined)).toBe('');
  });
});
