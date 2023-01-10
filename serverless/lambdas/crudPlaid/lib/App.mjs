import DdbClient from './DdbClient.mjs';
import PlaidClient from './PlaidClient.mjs';

class App {
  constructor(payload) {
    this.plaidClient = PlaidClient;
    this.ddbClient = DdbClient;
    this.user = {};
    this.payload = payload;
  }

  async setUserByToken(token) {
    if (!token) throw new Error('Missing required arguments');
    // decode & parse jwt payload
    const tokenPayload = token.split('.')[1];
    const decrypted = JSON.parse(Buffer.from(tokenPayload, 'base64'));

    this.user = await this.ddbClient.getUserByTokenEmail(decrypted.email);
  }

  async getLinkToken() {
    return await this.plaidClient.createLinkTokenByUserId(this.user.userId);
  }

  async handleTokenExchange() {
    const tokenExchange = await this.plaidClient.exchangePublicToken(
      this.payload.public_token
    );
    await this.ddbClient.addPlaidItemToUser(
      this.user.email,
      tokenExchange,
      this.payload.accounts
    );
    return { item_id: tokenExchange.item_id };
  }

  async handleGetItemAccounts() {
    const { accounts } = await this.ddbClient.getItemByItemId(
      this.user.email,
      this.payload.item_id
    );

    return { accounts };
  }

  async handleSyncTxsForItem() {
    const { accessToken, txCursor } = await this.ddbClient.getItemByItemId(
      this.user.email,
      this.payload.item_id
    );

    console.log({ accessToken, txCursor });

    const { newTxCursor, added, modified, removed } =
      await this.plaidClient.syncTxsForItem(accessToken, txCursor);

    await this.ddbClient.setItemTxCursor(
      this.user.email,
      this.payload.item_id,
      newTxCursor
    );

    return {
      added: added.length,
      modified: modified.length,
      removed: removed.length,
    };
  }
}

export default App;
