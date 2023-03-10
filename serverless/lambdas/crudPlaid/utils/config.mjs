import * as dotenv from 'dotenv';

dotenv.config();

const awsRegion = 'us-east-1';

const config = {
  awsRegion,
  dynamoDbBatchRequestLength: 25,
  appName: 'Mesh App',
  redirectUri: 'https://www.mesh-app.net',
  jwks: `https://cognito-idp.${awsRegion}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  TableName: {
    user: process.env.USER_TABLE_NAME /* prod or test table */,
    transaction: process.env.TRANSACTION_TABLE_NAME /* prod or test table */,
  },
  path: {
    linkTokenCreate: '/link/token-create',
    itemTokenExchange: '/item/token-exchange',
    itemTokenExchangeTest: '/item/token-exchange/test',
    getItems: '/item',
    itemGetAccounts: '/item/account',
    getAccountBalances: '/item/account/balance',
    getAccountTransactions: '/item/account/transaction',
    itemGetInstitution: '/item/institution',
    itemTxSync: '/item/sync',
    itemTxSyncTest: '/item/sync/test',
  },
  itemKeys: {
    lastActivity: 'last_activity',
    plaidItem: 'plaid_item',
    txCursor: 'tx_cursor',
    txCursorUpdatedAt: 'tx_cursor_updated_at',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
};

export default config;
