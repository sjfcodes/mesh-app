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
  event: {
    httpMethod: 'PUT',
    path: path.linkTokenCreate,
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
  event: {
    httpMethod: 'POST',
    path: path.itemTokenExchangeTest,
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
  event: {
    httpMethod: 'PUT',
    path: path.testItemTransactionSync,
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
  event: {
    httpMethod: 'GET',
    path: path.itemAccountTransaction,
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
  event: {
    httpMethod: 'GET',
    path: path.itemAccountTransaction,
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
  event: {
    httpMethod: 'GET',
    path: path.userItem,
  },
  params,
};

export const getUserAccountsRequest = {
  body: {},
  event: {
    httpMethod: 'GET',
    path: path.itemAccount,
  },
  params,
};

export const getUserAccountsBalancesRequest = {
  body: {},
  event: {
    httpMethod: 'GET',
    path: path.itemAccountBalance,
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
  event: {
    httpMethod: 'GET',
    path: path.itemInstitution,
  },
  params: {
    ...params,
    querystring: { institution_id: 'ins_115585' },
  },
};
