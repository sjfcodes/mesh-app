import { handler } from "./index.mjs";

describe("testFunction", () => {
  it("should have body property", async () => {
    const response = await handler({ body: "test" });
    expect(response).toHaveProperty("body");
  });

  it("should contain axios data", async () => {
    const { body: stringified } = await handler({ body: "test" });
    const body = JSON.parse(stringified);
    expect(body).toHaveProperty("data");
  });
});
