import * as dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

import config from '../utils/config.js';

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
      country_codes: ['US'],
      redirect_uri: config.redirectUri,
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

  async updateItemLogin(userId, accessToken) {
    if (!userId || !accessToken) throw new Error('missing required arguments!');
    const request = {
      user: { client_user_id: userId },
      client_name: config.appName,
      language: 'en',
      country_codes: ['US'],
      redirect_uri: config.redirectUri,
      access_token: accessToken,
    };

    const { data } = await this.client.linkTokenCreate(request);
    return data;
  }

  async getItemAccountBalances(accessToken, accountIds) {
    if (!accessToken) throw new Error('missing accessToken!');
    if (!accountIds.length) throw new Error('missing accountIds!');
    /**
     * NOTE: plaid request takes almost ~50 seconds to complete.
     * 
     * #. account balance can relate to txCursor.
     * #. if item txCursor changes, 
     *    - update account balances
     *    - update txCursor for new balances.
     */

    console.log({ accountIds });

    const request = {
      access_token: accessToken,
      options: {
        account_ids: accountIds,
      },
    };

    const response = await this.client.accountsBalanceGet(request);
    const accounts = response.data.accounts;

    console.log({ accounts });

    return { accounts };
  }

  async getItemInstitution(instId) {
    if (!instId) throw new Error('missing required arguments!');
    const request = {
      institution_id: instId,
      country_codes: ['US'],
      options: {
        include_optional_metadata: true,
      },
    };

    const {
      data: { institution },
    } = await this.client.institutionsGetById(request);
    const response = Array.isArray(institution) ? institution : [institution];

    return response;
  }

  async itemSyncTransactions(accessToken, cursor) {
    if (!accessToken || cursor === undefined)
      throw new Error('missing required arguments!');
    console.log(`itemSyncTransactions(${accessToken}, ${cursor})`);
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
