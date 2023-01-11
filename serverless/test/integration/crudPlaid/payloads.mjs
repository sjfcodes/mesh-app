import lambdaConfig from '../../../lambdas/crudPlaid/utils/config.mjs';
import dynamoDbConfig from '../../config/dynamoDb.mjs';

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;

export const createTokenLinkPayload = {
  body: {
    TableName: TableName.user,
    path: path.linkTokenCreate,
  },
  context: { ['http-method']: 'PUT' },
  params,
};

export const exchangeTokenLinkPayload = {
  body: {
    path: path.itemTokenExchange,
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
      institution_name: "Boeing Employees Credit Union (BECU) - Personal Online Banking",
      public_token: 'public-sandbox-39f63a49-ada5-44ef-8d74-e702c9b6a6ed',
      user_id: '02f25056-fe04-49a0-8c07-c509a245ff8e',
    },
  },
  context: { ['http-method']: 'POST' },
  params,
};

export const syncTransactionsForItemPayload = (itemId) => ({
  body: {
    path: path.itemTxSync,
    payload: { item_id: itemId },
  },
  context: { ['http-method']: 'PUT' },
  params,
});

export const getUserAccountsPayload = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemGetAccounts,
  },
  params,
};

export const getInstitutionByIdPayload = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemGetInstitution,
  },
  params: {
    ...params,
    querystring:{ institution_id: 'ins_115585'}
  },
};
