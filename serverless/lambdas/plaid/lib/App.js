import { convertToNative } from '@aws-sdk/util-dynamodb';
import ddbClient from './DdbClient.js';
import plaidClient from './PlaidClient.js';

class App {
  constructor(event) {
    this.plaidClient = plaidClient;
    this.ddbClient = ddbClient;
    this.user = {};
    this.requestPath = event.path;
    this.payload = event.body ? JSON.parse(event.body)?.payload : {};
    this.queryString = event.queryStringParameters;
  }

  async setUserByToken(token) {
    if (!token) throw new Error('missing token!');
    // decode & parse jwt payload
    const tokenPayload = token.split('.')[1];
    const decrypted = JSON.parse(Buffer.from(tokenPayload, 'base64'));

    console.log({ decrypted });

    const user = await this.ddbClient.readUserByTokenEmail(
      decrypted.email,
      this.requestPath
    );

    console.log('setting user:', user);
    this.user = user;
  }

  async handleLinkTokenCreateUpdate() {
    return await this.plaidClient.createLinkTokenByUserId(this.user.userId);
  }

  async handleItemTokenExchange() {
    const tokenExchange = await this.plaidClient.exchangePublicToken(
      this.payload.public_token
    );

    // include item_id for future api calls
    const formattedAccounts = this.payload.accounts.map((account) => ({
      ...account,
      item_id: tokenExchange.item_id,
    }));

    await this.ddbClient.writeUserLastActivity(this.user.email);

    await this.ddbClient.writeUserPlaidItem({
      email: this.user.email,
      tokenExchange,
      accounts: formattedAccounts,
      institution_id: this.payload.institution_id,
      institution_name: this.payload.institution_name,
    });

    return { accounts, item_id: tokenExchange.item_id };
  }

  async handleItemTokenExchangeMock() {
    await this.ddbClient.writeUserLastActivity(this.user.email);
    // include item_id for future api calls
    const formattedAccounts = this.payload.accounts.map((account) => ({
      ...account,
      item_id: this.payload.public_token.item_id,
    }));

    await this.ddbClient.writeUserPlaidItem({
      accounts: formattedAccounts,
      email: this.user.email,
      tokenExchange: this.payload.public_token,
      institution_id: this.payload.institution_id,
      institution_name: this.payload.institution_name,
    });

    return {
      accounts: formattedAccounts,
      item_id: this.payload.public_token.item_id,
    };
  }

  async handleGetItems() {
    const { items, lastActivity } = await this.ddbClient.readUserItems(
      this.user.email
    );

    const formatted = Object.entries(items).reduce((prev, [item_id, item]) => {
      const copy = convertToNative(item);
      delete copy.access_token;
      return {
        ...prev,
        [item_id]: copy,
      };
    }, {});

    return { items: formatted, last_activity: lastActivity };
  }

  async handleGetItemAccounts() {
    const { accounts } = await this.ddbClient.readUserAccounts(this.user.email);

    return { accounts };
  }

  async handleGetItemAccountBalances() {
    const { item_id: itemId, account_id: accountId } = this.queryString;
    const accountIds = [];

    if (accountId) {
      accountIds.push(accountId);
    }

    const { accessToken } = await this.ddbClient.readItemByItemId(
      this.user.email,
      itemId
    );

    const { accounts } = await this.plaidClient.getItemAccountBalances(
      accessToken,
      accountIds
    );

    console.log(accounts);

    const formatted = accounts.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.account_id]: curr,
      };
    }, {});

    return { account: formatted };
  }

  async handleGetUserAccountTransactions() {
    const nowInMs = Date.now();
    const monthInMs = 60 * 60 * 24 * 30 * 1000;
    const { account_id, item_id, lower_band, upper_band } = this.queryString;
    let upperBand = upper_band;
    let lowerBand = lower_band;

    if (!upperBand) {
      // default to current day
      upperBand = new Date(nowInMs).toISOString().substring(0, 10);
    }

    if (!lowerBand) {
      // default to last 30 days
      lowerBand = new Date(nowInMs - monthInMs).toISOString().substring(0, 10);
    }

    const { transactions } = await this.ddbClient.readAccountTransactions(
      item_id,
      account_id,
      upperBand,
      lowerBand
    );

    return { transactions };
  }

  async handleGetItemInstitutionById() {
    const data = await this.plaidClient.getItemInstitution(
      this.queryString.institution_id
    );

    return data;
  }

  async handleUserItemSyncTransactionsTest() {
    // mock getting newTxCursor & transactions from db
    const {
      item_id: itemId,
      transactions: { added, modified, removed },
      tx_cursor: newTxCursor,
    } = this.payload;

    // perform item read to replicate sync workflow
    const test = await this.ddbClient.readItemByItemId(this.user.email, itemId);
    if (!test.accessToken) throw new Error('missing accessToken');
    if (!test.accounts.length) throw new Error('missing accounts.length');
    if (!test.createdAt) throw new Error('missing createdAt');
    if (!test.updatedAt) throw new Error('missing updatedAt');

    await this.ddbClient.writeUserItemTransaction({
      itemId,
      added,
      modified,
      removed,
    });

    const { tx_cursor_updated_at } = await this.ddbClient.writeUserItemTxCursor(
      this.user.email,
      itemId,
      newTxCursor
    );

    return {
      added: added.length,
      modified: modified.length,
      removed: removed.length,
      tx_cursor_updated_at,
    };
  }

  async handleUserItemSyncTransactions() {
    const { item_id: itemId } = this.payload;
    // get current txCursor value from db,
    const { accessToken, txCursor } = await this.ddbClient.readItemByItemId(
      this.user.email,
      itemId
    );

    const { newTxCursor, added, modified, removed } =
      await this.plaidClient.itemSyncTransactions(accessToken, txCursor);

    // write items to db before writing cursor to db
    await this.ddbClient.writeUserItemTransaction({
      itemId,
      added,
      modified,
      removed,
    });

    const { tx_cursor_updated_at } = await this.ddbClient.writeUserItemTxCursor(
      this.user.email,
      itemId,
      newTxCursor
    );

    return {
      added: added.length,
      modified: modified.length,
      removed: removed.length,
      tx_cursor_updated_at,
    };
  }
  async handleUpdateUserItemLogin() {
    const { accessToken } = await this.ddbClient.readItemByItemId(
      this.user.email,
      this.payload.item_id
    );

    const response = await this.plaidClient.updateItemLogin(
      this.user.user_id,
      accessToken
    );

    return response;
  }
}

export default App;
