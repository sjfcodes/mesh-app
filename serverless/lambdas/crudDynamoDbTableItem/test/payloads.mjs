import config from "../../../config/dynamoDb.mjs";

const {
  TableName,
  Item: { original },
} = config;

export const createTableItemPayload = {
  body: { TableName, Item: original },
  context: { ["http-method"]: "PUT" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
};

export const getTableItemPayload = {
  body: {
    TableName,
    Key: {
      email: { S: original.email.S },
    },
  },
  context: { ["http-method"]: "GET" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
};

export const updateTableItemPayload = ({
  UpdateExpression,
  ExpressionAttributeValues,
}) => ({
  body: {
    TableName,
    Key: { email: { S: original.email.S } },
    UpdateExpression, //   UpdateExpression: "SET verified = :v, someData = :sd",
    ExpressionAttributeValues, //   ExpressionAttributeValues: { ":v": update.verified, ":sd": update.someData },
    ReturnValues: "ALL_NEW", //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
  },
  context: { ["http-method"]: "POST" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
});

export const deleteTableItemPayload = {
  body: {
    TableName,
    Key: { email: { S: original.email.S } },
  },
  context: { ["http-method"]: "DELETE" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
};

export const createPlaidItemPayload = {
  body: { TableName, Item: original },
  context: { ["http-method"]: "PUT" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
}