import config from "../../../config/dynamoDb.mjs";

const { TableName } = config;

export const createTablePayload = {
  body: {
    TableName,
    AttributeDefinitions: [
      {
        AttributeName: "email",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "email",
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
  context: { ["http-method"]: "PUT" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
};

export const deleteTablePayload = {
  body: { TableName },
  context: { ["http-method"]: "DELETE" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
};

export const getTablePayload = {
  body: { TableName },
  context: { ["http-method"]: "GET" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
};
