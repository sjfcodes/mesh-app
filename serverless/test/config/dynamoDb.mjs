import * as dotenv from 'dotenv';
import mockData from '../integration/crudPlaid/mockData/plaid';

dotenv.config();

const config = {
  TableName: {
    user: process.env.USER_TABLE_NAME /* prod or test table */,
    transaction: process.env.TRANSACTION_TABLE_NAME /* prod or test table */,
  },
  Item: {
    original: {
      email: { S: process.env.USER_EMAIL },
      user_id: { S: process.env.USER_EMAIL },
      plaid_item: {
        M: {
          [mockData.tokenExchange.item_id]: {
            M: {
              access_token: {
                S: mockData.tokenExchange.access_token,
              },
              accounts: {
                S: JSON.stringify(mockData.accounts),
              },
              created_at: {
                S: '2023-01-12T22:11:53.103Z',
              },
              id: {
                S: mockData.tokenExchange.item_id,
              },
              institution_id: {
                S: mockData.institutionId,
              },
              institution_name: {
                S: mockData.institutionName,
              },
              tx_cursor: {
                S: '',
              },
              tx_cursor_updated_at: {
                S: '2023-01-12T22:11:53.103Z',
              },
              updated_at: {
                S: '2023-01-12T22:11:53.103Z',
              },
            },
          },
        },
      },
      verified: { BOOL: false },
    },
    update: {
      verified: { BOOL: true },
    },
  },
};

export default config;
