import dynamoDbConfig from '../../config/dynamoDb.js';
import lambdaConfig from '../../../lambdas/crudPlaid/utils/config.js';

const { path } = lambdaConfig;
const { TableName, Item } = dynamoDbConfig;

export const createTableItemRequest = {
  body: {
    path: null,
    payload: { TableName: TableName.user, Item: Item.original },
  },
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.dynamoDbTableItem,
  },
};

export const getTableItemRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Key: {
        email: Item.original.email,
      },
    },
  },
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.dynamoDbTableItem,
  },
};

export const updateTableItemRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Key: { email: Item.original.email },
      UpdateExpression: 'SET verified = :verified',
      ExpressionAttributeValues: {
        ':verified': Item.update.verified,
      },
      ReturnValues: 'ALL_NEW', //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
    },
  },
  context: {
    ['http-method']: 'POST',
    ['resource-path']: path.dynamoDbTableItem,
  },
};

export const deleteTableItemRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Key: { email: Item.original.email },
    },
  },
  context: {
    ['http-method']: 'DELETE',
    ['resource-path']: path.dynamoDbTableItem,
  },
};

export const createPlaidItemPayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Item: Item.original,
    },
  },
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.dynamoDbTableItem,
  },
};
