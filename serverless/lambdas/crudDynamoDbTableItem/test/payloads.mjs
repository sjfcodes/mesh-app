import config from "../../../config/dynamoDb.mjs";

const {
  TableName,
  Item: { original },
} = config;

export const createTableItemPayload = {
  httpMethod: "PUT",
  body: { TableName, Item: original },
};

export const getTableItemPayload = {
  httpMethod: "GET",
  body: {
    TableName,
    Key: {
      username: { S: original.username.S },
    },
  },
};

export const updateTableItemPayload = ({
  UpdateExpression,
  ExpressionAttributeValues,
}) => ({
  httpMethod: "POST",
  body: {
    TableName,
    Key: { username: { S: original.username.S } },
    UpdateExpression, //   UpdateExpression: "SET verified = :v, someData = :sd",
    ExpressionAttributeValues, //   ExpressionAttributeValues: { ":v": update.verified, ":sd": update.someData },
    ReturnValues: "ALL_NEW", //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
  },
});

export const deleteTableItemPayload = {
  httpMethod: "DELETE",
  body: {
    TableName,
    Key: { username: { S: original.username.S } },
  },
};
