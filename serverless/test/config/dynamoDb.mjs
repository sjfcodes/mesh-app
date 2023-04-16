import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  TableName: {
    user: process.env.USER_TABLE_NAME /* prod or test table */,
    transaction: process.env.TRANSACTION_TABLE_NAME /* prod or test table */,
  },
  Item: {
    original: {
      email: { S: 'sjfcodes@gmail.com' },
      user_id: { S: '02f25056-fe04-49a0-8c07-c509a245ff8e' },
      plaid_item: {
        M: {},
      },
      verified: { BOOL: false },
    },
    update: {
      verified: { BOOL: true },
    },
  }
};

export default config;
