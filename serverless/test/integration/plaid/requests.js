import lambdaConfig from '../../../lambdas/plaid/utils/config.js';
import dynamoDbConfig from '../../config/dynamoDb.js';
import mockPlaid from './mockData/plaid.js';

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;
const { headers } = params;

export const createTokenLinkRequest = {
  body: {
    TableName: TableName.users,
    path: path.linkTokenCreate,
  },
  event: {
    httpMethod: 'PUT',
    path: path.linkTokenCreate,
  },
  headers,
};

export const mockExchangeTokenLinkRequest = {
  body: {
    path: path.itemTokenExchangeMock,
    payload: {
      accounts: mockPlaid.accounts,
      institution_id: mockPlaid.institutionId,
      institution_name: mockPlaid.institutionName,
      /** typically a public token that is protected and exchanged server side */
      public_token: mockPlaid.tokenExchange,
      user_id: '02f25056-fe04-49a0-8c07-c509a245ff8e',
    },
  },
  httpMethod: 'POST',
  path: path.itemTokenExchangeMock,
  headers,
};

export const mockSyncTransactionsForItemRequest = {
  body: {
    payload: {
      item_id: mockPlaid.tokenExchange.item_id,
      transactions: mockPlaid.transactions,
      tx_cursor: mockPlaid.txCursor,
    },
  },
  httpMethod: 'PUT',
  path: path.itemSyncMock,
  headers,
  queryStringParameters: {
    item_id: mockPlaid.tokenExchange.item_id,
  },
};

export const getTransactionsForAccountWithBandsRequest = {
  body: {},
  httpMethod: 'GET',
  path: path.itemAccountTransaction,
  headers,
  queryStringParameters: {
    account_id: mockPlaid.accounts[1].id,
    item_id: mockPlaid.tokenExchange.item_id,
    lower_band: '2022-12-01',
    upper_band: '2022-12-31',
  },
};

export const getTransactionsForAccountWithoutBandsRequest = {
  body: {},
  httpMethod: 'GET',
  path: path.itemAccountTransaction,
  headers,
  queryStringParameters: {
    account_id: mockPlaid.accounts[1].id,
    item_id: mockPlaid.tokenExchange.item_id,
  },
};

export const getUserItemsRequest = {
  httpMethod: 'GET',
  path: path.userItem,
  headers,
};

export const getUserAccountsRequest = {
  httpMethod: 'GET',
  path: path.itemAccount,
  headers,
};

export const getUserAccountsBalancesRequest = {
  httpMethod: 'GET',
  path: path.itemAccountBalance,
  headers,
  queryStringParameters: {
    item_id: mockPlaid.tokenExchange.item_id,
  },
};

export const getInstitutionByIdRequest = {
  httpMethod: 'GET',
  path: path.itemInstitution,
  headers,
  queryStringParameters: {
    institution_id: 'ins_115585',
  },
};
