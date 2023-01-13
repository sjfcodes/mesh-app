import lambdaConfig from '../../../lambdas/crudPlaid/utils/config.mjs';
import dynamoDbConfig from '../../config/dynamoDb.mjs';
import mockPlaid from './mockData/plaid';

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;

export const createTokenLinkPayload = {
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

export const mockExchangeTokenLinkPayload = {
  body: {
    path: path.itemTokenExchangeTest,
    payload: {
      accounts: mockPlaid.accounts,
      institution_id: mockPlaid.institutionId,
      institution_name: mockPlaid.institutionName,
      public_token:
        mockPlaid.tokenExchange /** typically a public token that is protected and exchanged server side */,
      user_id: '02f25056-fe04-49a0-8c07-c509a245ff8e',
    },
  },
  context: {
    ['http-method']: 'POST',
    ['resource-path']: path.itemTokenExchangeTest,
  },
  params,
};

export const mockSyncTransactionsForItemPayload = {
  body: {
    payload: {
      item_id: mockPlaid.tokenExchange.item_id,
      transactions: mockPlaid.transactions,
      tx_cursor: mockPlaid.txCursor,
    },
  },
  context: {
    ['http-method']: 'PUT',
    ['resource-path']: path.itemTxSyncTest,
  },
  params,
};

export const getTransactionsForAccountPayload = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.getAccountTransactions,
  },
  params: {
    ...params,
    querystring: {
      account_id: mockPlaid.accounts[1].id,
      item_id: mockPlaid.tokenExchange.item_id,
    },
  },
};

export const getUserItemsPayload = {
  body: {},
  context: {
    ['http-method']: 'GET',
    ['resource-path']: path.getItems,
  },
  params,
};

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
    querystring: { institution_id: 'ins_115585' },
  },
};
