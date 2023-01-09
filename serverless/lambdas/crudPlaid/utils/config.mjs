import * as dotenv from 'dotenv';

dotenv.config();

const awsRegion = 'us-east-1';

const config = {
  awsRegion,
  appName: 'Mesh App',
  jwks: `https://cognito-idp.${awsRegion}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  TableName: process.env.USER_TABLE_NAME /* prod or test table */,
  path: {
    linkTokenCreate: '/link/token-create',
    linkTokenExchange: '/item/token-exchange',
    transactionsSync: '/item/tx-sync',
  },
  itemKeys: {
    plaidItem: 'plaid_item',
    txCursor: 'tx_cursor',
    // keyTxAdded: 'tx_added',
    // keyTxModified: 'tx_modified',
    // keyTxRemoved: 'tx_removed',
  },
};

export default config;
