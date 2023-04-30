import lambdaConfig from '../../../lambdas/plaid/utils/config.js';
import dynamoDbConfig from '../../config/dynamoDb.js';

const { path } = lambdaConfig;
const { TableName } = dynamoDbConfig;

////////////////
// USER TABLE //
////////////////

export const getUserTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  httpMethod: 'GET',
  path: path.dynamoDbTable,
};

export const deleteUserTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  event: {
    httpMethod: 'DELETE',
    path: path.dynamoDbTable,
  },
};

///////////////////////
// TRANSACTION TABLE //
///////////////////////

export const getTransactionTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
    },
  },
  event: {
    httpMethod: 'GET',
    path: path.dynamoDbTable,
  },
};

export const deleteTransactionTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
    },
  },
  event: {
    httpMethod: 'DELETE',
    path: path.dynamoDbTable,
  },
};
