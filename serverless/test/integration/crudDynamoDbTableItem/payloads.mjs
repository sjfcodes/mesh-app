import dynamoDbConfig from '../../config/dynamoDb.mjs';

const { TableName, Item, params } = dynamoDbConfig;

export const createTableItemPayload = {
  body: {
    path: null,
    payload: { TableName: TableName.user, Item: Item.original },
  },
  context: { ['http-method']: 'PUT' },
  params,
};

export const getTableItemPayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Key: {
        email: { S: Item.original.email.S },
      },
    },
  },
  context: { ['http-method']: 'GET' },
  params,
};

export const updateTableItemPayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Key: { email: { S: Item.original.email.S } },
      UpdateExpression: 'SET verified = :verified',
      ExpressionAttributeValues: {
        ':verified': Item.update.verified,
      },
      ReturnValues: 'ALL_NEW', //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
    },
  },
  context: { ['http-method']: 'POST' },
  params,
};

export const deleteTableItemPayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Key: { email: { S: Item.original.email.S } },
    },
  },
  context: { ['http-method']: 'DELETE' },
  params,
};

export const createPlaidItemPayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      Item: Item.original,
    },
  },
  context: { ['http-method']: 'PUT' },
  params,
};
