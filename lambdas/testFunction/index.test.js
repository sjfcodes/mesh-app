import { handler } from "./index.mjs";

describe("testFunction", () => {
  it("should return...", async () => {
    const response = await handler();
    console.log(response);
    expect(response).toHaveProperty('body')
  });
});
