import * as dotenv from 'dotenv';

dotenv.config();
import config from '../../config/dynamoDb.mjs';

const { TableName, params } = config;

console.log(69,TableName);

////////////////
// USER TABLE /
//////////////

export const createUserTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
      AttributeDefinitions: [
        {
          AttributeName: 'email',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'email',
          KeyType: 'HASH',
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
  context: { ['http-method']: 'PUT' },
  params,
};

export const getUserTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  context: { ['http-method']: 'GET' },
  params,
};

export const deleteUserTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  context: { ['http-method']: 'DELETE' },
  params,
};

///////////////////////
// TRANSACTION TABLE /
/////////////////////

export const createTransactionTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
      AttributeDefinitions: [
        {
          AttributeName: 'item_id::account_id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'transaction_id',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'item_id::account_id',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'transaction_id',
          KeyType: 'RANGE',
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
  context: { ['http-method']: 'PUT' },
  params,
};

export const getTransactionTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
    },
  },
  context: { ['http-method']: 'GET' },
  params,
};

export const deleteTransactionTablePayload = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
    },
  },
  context: { ['http-method']: 'DELETE' },
  params,
};
