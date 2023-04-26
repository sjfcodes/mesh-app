import lambdaConfig from '../../../lambdas/plaid/utils/config.js';
import dynamoDbConfig from '../../config/dynamoDb.js';
import mockPlaid from './mockData/plaid.js';

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;

export const createTokenLinkRequest = {
  body: {
    TableName: TableName.user,
    path: path.linkTokenCreate,
  },
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.linkTokenCreate,
  },
  params,
};

export const mockExchangeTokenLinkRequest = {
  body: {
    path: path.itemTokenExchangeTest,
    payload: {
      accounts: mockPlaid.accounts,
      institution_id: mockPlaid.institutionId,
      institution_name: mockPlaid.institutionName,
      /** typically a public token that is protected and exchanged server side */
      public_token: mockPlaid.tokenExchange,
      user_id: '02f25056-fe04-49a0-8c07-c509a245ff8e',
    },
  },
  context: {
    ['http-method']: 'POST',
    ['resource-path']: path.itemTokenExchangeTest,
  },
  params,
};

export const mockSyncTransactionsForItemRequest = {
  body: {
    payload: {
      item_id: mockPlaid.tokenExchange.item_id,
      transactions: mockPlaid.transactions,
      tx_cursor: mockPlaid.txCursor,
    },
  },
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.testItemTransactionSync,
  },
  params: {
    ...params,
    querystring: {
      item_id: mockPlaid.tokenExchange.item_id,
    },
  },
};

export const getTransactionsForAccountWithBandsRequest = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemAccountTransaction,
  },
  params: {
    ...params,
    querystring: {
      account_id: mockPlaid.accounts[1].id,
      item_id: mockPlaid.tokenExchange.item_id,
      lower_band: '2022-12-01',
      upper_band: '2022-12-31',
    },
  },
};

export const getTransactionsForAccountWithoutBandsRequest = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemAccountTransaction,
  },
  params: {
    ...params,
    querystring: {
      account_id: mockPlaid.accounts[1].id,
      item_id: mockPlaid.tokenExchange.item_id,
    },
  },
};

export const getUserItemsRequest = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.userItem,
  },
  params,
};

export const getUserAccountsRequest = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemAccount,
  },
  params,
};

export const getUserAccountsBalancesRequest = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemAccountBalance,
  },
  params: {
    ...params,
    querystring: {
      item_id: mockPlaid.tokenExchange.item_id,
    },
  },
};

export const getInstitutionByIdRequest = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.itemInstitution,
  },
  params: {
    ...params,
    querystring: { institution_id: 'ins_115585' },
  },
};
