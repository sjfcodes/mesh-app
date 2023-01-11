import ddbClient from './ddbClient.mjs';
import plaidClient from './plaidClient.mjs';

class App {
  constructor(event) {
    this.plaidClient = plaidClient;
    this.ddbClient = ddbClient;
    this.user = {};
    this.payload = event.body?.payload;
    this.queryString = event.params?.querystring;
  }

  async setUserByToken(token) {
    if (!token) throw new Error('Missing required arguments');
    // decode & parse jwt payload
    const tokenPayload = token.split('.')[1];
    const decrypted = JSON.parse(Buffer.from(tokenPayload, 'base64'));

    this.user = await this.ddbClient.readUserByTokenEmail(decrypted.email);
  }

  async getLinkToken() {
    return await this.plaidClient.createLinkTokenByUserId(this.user.userId);
  }

  async handleTokenExchange() {
    const tokenExchange = await this.plaidClient.exchangePublicToken(
      this.payload.public_token
    );

    // include item_id for future api calls
    const accounts = this.payload.accounts.map((account) => ({
      ...account,
      item_id: tokenExchange.item_id,
    }));

    await this.ddbClient.writePlaidItemToUser({
      email: this.user.email,
      tokenExchange,
      accounts,
      institution_id: this.payload.institution_id,
      institution_name: this.payload.institution_name,
    });

    return { accounts, item_id: tokenExchange.item_id };
  }

  async mockHandleTokenExchange() {
    const {
      public_token: tokenExchange,
      institution_id,
      institution_name,
    } = this.payload;

    // include item_id for future api calls
    const accounts = this.payload.accounts.map((account) => ({
      ...account,
      item_id: tokenExchange.item_id,
    }));

    await this.ddbClient.writePlaidItemToUser({
      email: this.user.email,
      tokenExchange,
      accounts,
      institution_id,
      institution_name,
    });

    return { accounts, item_id: tokenExchange.item_id };
  }

  async handleGetUserItems() {
    const { items } = await this.ddbClient.readUserItems(this.user.email);
    const formatted = Object.entries(items).reduce((prev, [item_id, item]) => {
      const copy = { ...item.M };
      delete copy.access_token;
      copy.accounts = { L: JSON.parse(copy.accounts.S) };
      return {
        ...prev,
        [item_id]: copy,
      };
    }, {});

    return { items: formatted };
  }

  async handleGetUserAccounts() {
    const { accounts } = await this.ddbClient.readUserAccounts(this.user.email);

    return { accounts };
  }

  async handleGetAccountTransactions() {
    const { account_id, item_id } = this.queryString;
    const { transactions } = await this.ddbClient.readAccountTransactions(
      item_id,
      account_id
    );

    return { transactions };
  }

  async handleGetInstitutionById() {
    const data = await this.plaidClient.getInstitutionById(
      this.queryString.institution_id
    );

    return data;
  }

  async mockHandleSyncTxsForItem() {
    const {
      item_id: itemId,
      transactions: { added, modified, removed },
    } = this.payload;

    const { accessToken } = await this.ddbClient.readItemByItemId(
      this.user.email,
      itemId
    );

    await this.ddbClient.writeTxsForItem({ itemId, added, modified, removed });

    return {
      added: added.length,
      modified: modified.length,
      removed: removed.length,
    };
  }

  async handleSyncTxsForItem() {
    const { item_id: itemId } = this.payload;
    const { accessToken, txCursor } = await this.ddbClient.readItemByItemId(
      this.user.email,
      itemId
    );

    const { newTxCursor, added, modified, removed } =
      await this.plaidClient.syncTxsForItem(accessToken, txCursor);

    await this.ddbClient.writeItemTxCursor(
      this.user.email,
      itemId,
      newTxCursor
    );

    await this.ddbClient.writeTxsForItem({ itemId, added, modified, removed });

    return {
      added: added.length,
      modified: modified.length,
      removed: removed.length,
    };
  }
}

export default App;
