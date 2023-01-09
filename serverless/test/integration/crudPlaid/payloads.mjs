import lambdaConfig from '../../../lambdas/crudPlaid/utils/config.mjs';
import dynamoDbConfig from '../../config/dynamoDb.mjs';

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;

export const createTokenLinkPayload = {
  body: {
    TableName,
    path: path.linkTokenCreate,
  },
  context: { ['http-method']: 'PUT' },
  params,
};

export const exchangeTokenLinkPayload = {
  body: {
    path: path.linkTokenExchange,
    payload: {
      accounts: [
        {
          id: 'dk9nVZ6WqnF4vGMxWlJVsWnDA7mxxLTDVAAZa',
          name: 'Plaid Checking',
          mask: '0000',
          type: 'depository',
          subtype: 'checking',
          verification_status: null,
          class_type: null,
        },
        {
          id: 'a8GWV7bgwWtx5Qkzvd8Vu7n1Ggryyzt1yGG7D',
          name: 'Plaid Saving',
          mask: '1111',
          type: 'depository',
          subtype: 'savings',
          verification_status: null,
          class_type: null,
        },
      ],
      institution_id: 'ins_115585',
      public_token: 'public-sandbox-3a78de5e-6ea8-452f-af88-0b2c09856dd5',
      user_id: '02f25056-fe04-49a0-8c07-c509a245ff8e',
    },
  },
  context: { ['http-method']: 'POST' },
  params,
};

export const syncTransactionsForItemPayload = (item_id) => ({
  body: {
    path: path.transactionsSync,
    payload: { item_id },
  },
  context: { ['http-method']: 'PUT' },
  params,
});
