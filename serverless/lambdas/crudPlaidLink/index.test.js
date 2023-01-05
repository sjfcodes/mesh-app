import { handler } from "./index.mjs";

const JEST_TEST_ID = "jest-test-0";

const testData = {
  id: { S: JEST_TEST_ID },
  someStatus: { BOOL: false },
};

describe("testFunction", () => {
  it("should PUT item to Table", async () => {
    const request = {
      httpMethod: "PUT",
      body: {
        TableName: "mesh-app-plaid-items",
        Item: testData,
      },
    };
    const response = await handler(request);

    expect(response).toHaveProperty("body");
  });
});
