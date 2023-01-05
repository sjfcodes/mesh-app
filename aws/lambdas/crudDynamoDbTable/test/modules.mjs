import config from "../../../../config/dynamoDb.mjs";
import { handler } from "../index.mjs";

const { TableName } = config;

export const createTable = async () => {
  const request = {
    httpMethod: "PUT",
    body: {
      TableName,
      AttributeDefinitions: [
        {
          AttributeName: "username",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "username",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      StreamSpecification: {
        StreamEnabled: false,
      },
    },
  };
  const response = await handler(request);
  // pause to let table finish creating
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return response;
};

export const deleteTable = async () => {
  const request = {
    httpMethod: "DELETE",
    body: {
      TableName,
    },
  };
  return await handler(request);
};

export const getTable = async () => {
  const request = {
    httpMethod: "GET",
    body: {
      TableName,
    },
  };
  return await handler(request);
};
