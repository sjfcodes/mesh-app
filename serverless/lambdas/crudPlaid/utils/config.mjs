import * as dotenv from 'dotenv';

dotenv.config();

const awsRegion = 'us-east-1';

const config = {
  awsRegion,
  dynamoDbBatchRequestLength: 25,
  appName: 'Mesh App',
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
    getAccountTransactions: '/item/account/transaction',
    itemGetInstitution: '/item/institution',
    itemTxSync: '/item/tx-sync',
    itemTxSyncTest: '/item/tx-sync/test',
  },
  itemKeys: {
    plaidItem: 'plaid_item',
    txCursor: 'tx_cursor',
  },
};

export default config;
