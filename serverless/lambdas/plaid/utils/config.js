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
    users: process.env.USER_TABLE_NAME /* prod or test table */,
    transactions: process.env.TRANSACTION_TABLE_NAME /* prod or test table */,
  },
  path: {
    ddbTable: '/table',
    ddbTableItem: '/table/item',
    linkTokenCreate: '/link/token_create',
    itemTokenExchange: '/item/token_exchange',
    itemTokenExchangeMock: '/item/token_exchange/mock',
    item: '/item',
    itemAccountBalance: '/item/account/balance',
    itemAccountTransaction: '/item/account/transaction',
    itemInstitution: '/item/institution',
    itemUpdateLogin: '/item/update_login',
    itemSync: '/item/sync',
    itemSyncMock: '/item/sync/mock',
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
