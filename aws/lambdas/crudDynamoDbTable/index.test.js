import { handler } from "./index.mjs";

describe("crudDynamoDbTable", () => {
  it("should PUT table", async () => {
    const request = {
      httpMethod: "PUT",
      body: {
        AttributeDefinitions: [
          {
            AttributeName: "Season", //ATTRIBUTE_NAME_1
            AttributeType: "N", //ATTRIBUTE_TYPE
          },
          {
            AttributeName: "Episode", //ATTRIBUTE_NAME_2
            AttributeType: "N", //ATTRIBUTE_TYPE
          },
        ],
        KeySchema: [
          {
            AttributeName: "Season", //ATTRIBUTE_NAME_1
            KeyType: "HASH",
          },
          {
            AttributeName: "Episode", //ATTRIBUTE_NAME_2
            KeyType: "RANGE",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        TableName: "jest-test-0",
        StreamSpecification: {
          StreamEnabled: false,
        },
      },
    };
    const { statusCode, body } = await handler(request);
    expect(statusCode).toBe(200);
    // pause to let table finish creating
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });

  it("should GET table", async () => {
    const request = {
      httpMethod: "GET",
      body: {
        TableName: "jest-test-0",
      },
    };
    const { statusCode, body } = await handler(request);
    expect(statusCode).toBe(200);
  });

  it("should DELETE table", async () => {
    const request = {
      httpMethod: "DELETE",
      body: {
        TableName: "jest-test-0",
      },
    };
    const { statusCode, body } = await handler(request);
    expect(statusCode).toBe(200);
  });
});
