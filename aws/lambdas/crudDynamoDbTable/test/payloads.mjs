import config from "../../../../config/dynamoDb.mjs";

const { TableName } = config;

export const createTablePayload = {
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
  httpMethod: "PUT",
};

export const deleteTablePayload = {
  body: { TableName },
  httpMethod: "DELETE",
};

export const getTablePayload = {
  body: { TableName },
  httpMethod: "GET",
};
