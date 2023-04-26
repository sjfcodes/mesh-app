import lambdaConfig from '../../../lambdas/plaid/utils/config.js';
import dynamoDbConfig from '../../config/dynamoDb.js';

const { path } = lambdaConfig;
const { TableName } = dynamoDbConfig;

////////////////
// USER TABLE //
////////////////

export const createUserTableRequest = {
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
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.dynamoDbTable,
  },
};

export const getUserTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.dynamoDbTable,
  },
};

export const deleteUserTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.user,
    },
  },
  context: {
    ['http-method']: 'DELETE',
    ['resource-path']: path.dynamoDbTable,
  },
};

///////////////////////
// TRANSACTION TABLE //
///////////////////////

export const createTransactionTableRequest = {
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
        {
          AttributeName: 'created_at',
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
      GlobalSecondaryIndexes: [
        // GlobalSecondaryIndexList
        {
          // GlobalSecondaryIndex
          IndexName: 'item_id-account_id-created_at-index', // required
          KeySchema: [
            // required
            {
              AttributeName: 'item_id::account_id',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'created_at',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
      StreamSpecification: {
        StreamEnabled: false,
      },
    },
  },
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.dynamoDbTable,
  },
};

export const getTransactionTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
    },
  },
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.dynamoDbTable,
  },
};

export const deleteTransactionTableRequest = {
  body: {
    path: null,
    payload: {
      TableName: TableName.transaction,
    },
  },
  context: {
    ['http-method']: 'DELETE',
    ['resource-path']: path.dynamoDbTable,
  },
};
