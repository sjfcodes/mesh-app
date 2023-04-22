import * as dotenv from 'dotenv';
import mockData from '../integration/plaid/mockData/plaid';

dotenv.config();

const config = {
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
  TableName: {
    user: process.env.USER_TABLE_NAME /* prod or test table */,
    transaction: process.env.TRANSACTION_TABLE_NAME /* prod or test table */,
  },
  Item: {
    original: {
      email: process.env.USER_EMAIL,
      user_id: process.env.USER_EMAIL,
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
