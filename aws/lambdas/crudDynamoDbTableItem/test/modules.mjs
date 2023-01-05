import config from "../../../../config/dynamoDb.mjs";
import { handler } from "../index.mjs";

const {
  TableName,
  Item: { original },
} = config;

export const createTableItem = async () => {
  const request = {
    httpMethod: "PUT",
    body: { TableName, Item: original },
  };

  return await handler(request);
};

export const getTableItem = async () => {
  const request = {
    httpMethod: "GET",
    body: {
      TableName,
      Key: {
        username: { S: original.username.S },
      },
    },
  };

  return await handler(request);
};

export const updateTableItem = async ({
  UpdateExpression,
  ExpressionAttributeValues,
}) => {
  const request = {
    httpMethod: "POST",
    body: {
      TableName,
      Key: { username: { S: original.username.S } },
      UpdateExpression, //   UpdateExpression: "SET verified = :v, someData = :sd",
      ExpressionAttributeValues, //   ExpressionAttributeValues: { ":v": update.verified, ":sd": update.someData },
      ReturnValues: "ALL_NEW", //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
    },
  };

  return await handler(request);
};

export const deleteTableItem = async () => {
    const request = {
        httpMethod: "DELETE",
        body: {
          TableName,
          Key: { username: { S: original.username.S } },
        },
      };

    return await handler(request);
};
