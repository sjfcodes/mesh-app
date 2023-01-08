import dynamoDbConfig from "../../config/dynamoDb.mjs";

const { TableName, Item, params } = dynamoDbConfig;

export const createTableItemPayload = {
  body: {
    path: null,
    payload: { TableName, Item: Item.original },
  },
  context: { ["http-method"]: "PUT" },
  params,
};

export const getTableItemPayload = {
  body: {
    path: null,
    payload: {
      TableName,
      Key: {
        email: { S: Item.original.email.S },
      },
    },
  },
  context: { ["http-method"]: "GET" },
  params,
};

export const updateTableItemRandomPayload = {
  body: {
    path: null,
    payload: {
      TableName,
      Key: { email: { S: Item.original.email.S } },
      UpdateExpression: "SET verified = :v, someData = :sd",
      ExpressionAttributeValues: {
        ":v": Item.update.verified,
        ":sd": Item.update.someData,
      },
      ReturnValues: "ALL_NEW", //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
    },
  },
  context: { ["http-method"]: "POST" },
  params,
};

export const deleteTableItemPayload = {
  body: {
    path: null,
    payload: {
      TableName,
      Key: { email: { S: Item.original.email.S } },
    },
  },
  context: { ["http-method"]: "DELETE" },
  params,
};

export const createPlaidItemPayload = {
  body: {
    path: null,
    payload: {
      TableName,
      Item: Item.original,
    },
  },
  context: { ["http-method"]: "PUT" },
  params,
};
