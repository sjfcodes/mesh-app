import config from "../../config/dynamoDb.mjs";

const { TableName, params } = config;

export const createTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
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
  },
  context: { ["http-method"]: "PUT" },
  params,
};

export const deleteTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  context: { ["http-method"]: "DELETE" },
  params,
};

export const getTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  context: { ["http-method"]: "GET" },
  params,
};
