import { handler } from "../index.mjs";

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

  it("should GET item from Table", async () => {
    const request = {
      httpMethod: "GET",
      body: {
        TableName: "mesh-app-plaid-items",
        Key: { id: testData.id },
      },
    };
    const { statusCode, body } = await handler(request);

    expect(statusCode).toBe(200);
    expect(body.Item.id.S).toBe(JEST_TEST_ID);
  });

  it("should POST item from Table", async () => {
    const request = {
      httpMethod: "POST",
      body: {
        TableName: "mesh-app-plaid-items",
        Key: { id: testData.id },
        UpdateExpression: "SET someStatus = :ss", // For example, "'set Title = :t, Subtitle = :s'"
        ExpressionAttributeValues: { ":ss": { BOOL: true } },
        ReturnValues: "UPDATED_NEW",
      },
    };
    const { statusCode, body } = await handler(request);

    expect(statusCode).toBe(200);
    expect(body.Attributes.someStatus.BOOL).toBe(true);
  });

  it("should DELETE item from Table", async () => {
    const request = {
      httpMethod: "DELETE",
      body: {
        TableName: "mesh-app-plaid-items",
        Key: { id: testData.id },
      },
    };
    const { statusCode } = await handler(request);

    expect(statusCode).toBe(200);
  });
});
