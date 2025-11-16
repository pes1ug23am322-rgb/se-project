const request = require("supertest");
const app = require("../../src/app");

jest.mock("../../src/services", () => ({
  fetchBlog: jest.fn(async () => "<p>Mock blog content</p>"),
  cleanHtml: jest.fn(() => "Mock cleaned content")
}));

describe("POST /convert", () => {
  test("returns success and metadata", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ url: "https://example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.id).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(res.body.metadata.cleanedLength).toBeDefined();
  }, 10000);
});
