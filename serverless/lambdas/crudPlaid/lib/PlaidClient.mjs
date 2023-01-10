import * as dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// https://plaid.com/docs/api/tokens/#linktokencreate

dotenv.config();

const {
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_SECRET_DEVELOPMENT,
  PLAID_SECRET_SANDBOX,
  //   PLAID_SANDBOX_REDIRECT_URI,
  //   PLAID_DEVELOPMENT_REDIRECT_URI,
} = process.env;

// The Plaid secret is unique per environment. Note that there is also a separate production key,
// though we do not account for that here.
const PLAID_SECRET =
  PLAID_ENV === 'development' ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

class PlaidClient {
  constructor(configuration) {
    this.client = new PlaidApi(configuration);
  }

  async createLinkTokenByUserId(userId) {
    if (!userId) throw new Error('missing required arguments!');
    const request = {
      user: { client_user_id: userId },
      client_name: config.appName,
      products: ['auth'],
      language: 'en',
      // webhook: "https://webhook.example.com",
      country_codes: ['US'],
    };

    const { data } = await this.client.linkTokenCreate(request);
    return data;
  }

  async exchangePublicToken(publicToken) {
    if (!publicToken) throw new Error('missing required arguments!');
    const { data } = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // { access_token, user_id, request_id }
    return data;
  }

  async syncTxsForItem(accessToken, cursor) {
    if (!accessToken || cursor === undefined)
      throw new Error('missing required arguments!');

    // New transaction updates since "cursor"
    let added = [];
    let modified = [];

    // Removed transaction ids
    let removed = [];
    let hasMore = true;

    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await this.client.transactionsSync({
        access_token: accessToken,
        cursor,
      });

      const data = response.data;

      // Add this page of results
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;

      // Update cursor to the next cursor
      cursor = data.next_cursor;
    }

    return {
      newTxCursor: cursor,
      added,
      modified,
      removed,
    };
  }
}

export default new PlaidClient(configuration);
