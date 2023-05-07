import * as dotenv from 'dotenv';
import mockData from '../integration/plaid/mockData/plaid';

dotenv.config();

const {
  env: { USE_API_GATEWAY, AWS_API_GW_DEV, AWS_API_GW_PROD },
} = process;

const targetEnv = USE_API_GATEWAY || 'DEV'

if(targetEnv === 'PROD') throw new Error('PROD not yet supported, could possibly erase data!')

const AWS_API_GW_TARGET = {
  DEV: AWS_API_GW_DEV,
  PROD: AWS_API_GW_PROD,
}[targetEnv];

const targetApiUrl = AWS_API_GW_TARGET;

console.log({ targetApiUrl });

const config = {
  targetApiUrl,
  params: {
    headers: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
  TableName: {
    users: `mesh-app.${targetEnv.toLowerCase()}.users`,
    transactions: `mesh-app.${targetEnv.toLowerCase()}.transactions`
  },
  Item: {
    original: {
      email: process.env.USER_EMAIL,
      user_id: process.env.USER_ID,
      plaid_item: {
        [mockData.tokenExchange.item_id]: {
          access_token: mockData.tokenExchange.access_token,
          accounts: JSON.stringify(mockData.accounts),
          created_at: '2023-01-12T22:11:53.103Z',
          id: mockData.tokenExchange.item_id,
          institution_id: mockData.institutionId,
          institution_name: mockData.institutionName,
          tx_cursor: '',
          tx_cursor_updated_at: '2023-01-12T22:11:53.103Z',
          updated_at: '2023-01-12T22:11:53.103Z',
        },
      },
      verified: false,
    },
    update: {
      verified: true,
    },
  },
};

export default config;
