import * as dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

import config from '../utils/config.js';

// https://plaid.com/docs/api/tokens/#linktokencreate

dotenv.config();

const {
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_ENV,
} = process.env;

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
    if (!userId) throw new Error('missing userId!');
    if (!accessToken) throw new Error('missing accessToken!');

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

  async getBalancesByAccountId(accessToken, accountIds) {
    if (!accessToken) throw new Error('missing accessToken!');

    const request = { access_token: accessToken };
    if (accountIds.length) request.options = { account_ids: accountIds };

    const response = await this.client.accountsGet(request);
    // const response = await this.client.accountsBalanceGet(request);
    const accounts = response.data.accounts;

    return { accounts };
  }

  async getInstitutionById(instId) {
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
