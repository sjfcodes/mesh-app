import config from '../utils/config.mjs';
import ddbClient from './ddbClient.mjs';
import plaidClient from './plaidClient.mjs';

class App {
  constructor(event) {
    this.plaidClient = plaidClient;
    this.ddbClient = ddbClient;
    this.user = {};
    this.requestPath = event.context['resource-path'];
    this.payload = event.body?.payload;
    this.queryString = event.params?.querystring;
  }

  async setUserByToken(token) {
    if (!token) throw new Error('Missing required arguments');
    // decode & parse jwt payload
    const tokenPayload = token.split('.')[1];
    const decrypted = JSON.parse(Buffer.from(tokenPayload, 'base64'));

    this.user = await this.ddbClient.readUserByTokenEmail(decrypted.email, this.requestPath);
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
    const { items, lastActivity } = await this.ddbClient.readUserItems(
      this.user.email
    );
    const formatted = Object.entries(items).reduce((prev, [item_id, item]) => {
      const copy = { ...item.M };
      delete copy.access_token;
      copy.accounts = JSON.parse(copy.accounts.S);
      copy.created_at = copy.created_at.S;
      copy.id = item_id;
      copy.institution_id = copy.institution_id.S;
      copy.institution_name = copy.institution_name.S;
      copy[config.itemKeys.txCursor] = copy[config.itemKeys.txCursor].S;
      copy[config.itemKeys.txCursorUpdatedAt] =
        copy[config.itemKeys.txCursorUpdatedAt].S;
      copy.updated_at = copy.updated_at.S;
      return {
        ...prev,
        [item_id]: copy,
      };
    }, {});

    return { items: formatted, last_activity: lastActivity };
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

    const formatted = transactions.map((tx) => {
      const copy = { ...tx };
      copy.created_at = tx.created_at.S;
      copy.updated_at = tx.updated_at.S;
      copy.transaction_id = tx.transaction_id.S;
      copy['item_id::account_id'] = tx['item_id::account_id'].S;
      copy.transaction = JSON.parse(tx.transaction.S);
      return copy;
    });
    return { transactions: formatted };
  }

  async handleGetInstitutionById() {
    const data = await this.plaidClient.getItemInstitution(
      this.queryString.institution_id
    );

    return data;
  }

  async mockHandleItemSyncTransactions() {
    // mock getting newTxCursor & transactions from db
    const {
      item_id: itemId,
      transactions: { added, modified, removed },
      tx_cursor: newTxCursor,
    } = this.payload;

    await this.ddbClient.writeTxsForItem({ itemId, added, modified, removed });

    const { tx_cursor_updated_at } = await this.ddbClient.writeItemTxCursor(
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

  async handleItemSyncTransactions() {
    const { item_id: itemId } = this.payload;
    console.log('handleItemSyncTransactions()');
    // get current txCursor value from db,
    const { accessToken, txCursor } = await this.ddbClient.readItemByItemId(
      this.user.email,
      itemId
    );

    const { newTxCursor, added, modified, removed } =
      await this.plaidClient.itemSyncTransactions(accessToken, txCursor);

    // write items to db before writing cursor to db
    await this.ddbClient.writeTxsForItem({ itemId, added, modified, removed });

    const { tx_cursor_updated_at } = await this.ddbClient.writeItemTxCursor(
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
}

export default App;
