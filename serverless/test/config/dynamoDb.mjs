import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  TableName: {
    user: 'mesh-app-users-test',
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
  },
  params: { header: { Authorization: process.env.AUTH_TOKEN } },
};

export default config;
