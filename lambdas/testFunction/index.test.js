import { handler } from "./index.mjs";

describe("testFunction", () => {
  it("should have body property", async () => {
    const response = await handler({});
    expect(response).toHaveProperty("body");
  });
});
