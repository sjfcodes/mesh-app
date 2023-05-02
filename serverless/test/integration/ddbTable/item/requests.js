import dynamoDbConfig from '../../../config/dynamoDb.js';
import lambdaConfig from '../../../../lambdas/plaid/utils/config.js';

const { path } = lambdaConfig;
const { TableName, Item, params } = dynamoDbConfig;
const { headers } = params;

const userItem = { ...Item.original };
userItem.plaid_item = {};

export const addUserRequest = {
  headers,
  body: {
    TableName: TableName.user,
    Item: userItem,
  },
  httpMethod: 'PUT',
  path: path.ddbTableItem,
};

export const addUserItemRequest = {
  headers,
  body: {
    TableName: TableName.user,
    Item: Item.original,
  },
  httpMethod: 'PUT',
  path: path.ddbTableItem,
};

export const getTableItemRequest = {
  headers,
  httpMethod: 'GET',
  path: path.ddbTableItem,
  queryStringParameters: {
    TableName: TableName.user,
    Key: 'email',
    Value: Item.original.email,
  },
};

export const updateTableItemRequest = {
  headers,
  body: {
    TableName: TableName.user,
    Key: { email: Item.original.email },
    UpdateExpression: 'SET verified = :verified',
    ExpressionAttributeValues: {
      ':verified': Item.update.verified,
    },
    ReturnValues: 'ALL_NEW', //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
  },
  httpMethod: 'POST',
  path: path.ddbTableItem,
};

export const deleteTableItemRequest = {
  headers,
  body: {
    TableName: TableName.user,
    Key: { email: Item.original.email },
  },
  httpMethod: 'DELETE',
  path: path.ddbTableItem,
};

export const createPlaidItemPayload = {
  headers,
  body: {
    TableName: TableName.user,
    Item: Item.original,
  },
  httpMethod: 'PUT',
  path: path.ddbTableItem,
};
