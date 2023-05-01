import dynamoDbConfig from '../../../config/dynamoDb.js';
import lambdaConfig from '../../../../lambdas/plaid/utils/config.js';

const { path } = lambdaConfig;
const { TableName, Item } = dynamoDbConfig;

export const createTableItemRequest = {
  body: {
    TableName: TableName.user,
    Item: Item.original,
  },
  httpMethod: 'PUT',
  path: path.dynamoDbTableItem,
};

export const getTableItemRequest = {
  body: {
    TableName: TableName.user,
    Key: {
      email: Item.original.email,
    },
  },
  httpMethod: 'GET',
  path: path.dynamoDbTableItem,
};

export const updateTableItemRequest = {
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
  path: path.dynamoDbTableItem,
};

export const deleteTableItemRequest = {
  body: {
    TableName: TableName.user,
    Key: { email: Item.original.email },
  },
  httpMethod: 'DELETE',
  path: path.dynamoDbTableItem,
};

export const createPlaidItemPayload = {
  body: {
    TableName: TableName.user,
    Item: Item.original,
  },
  httpMethod: 'PUT',
  path: path.dynamoDbTableItem,
};
