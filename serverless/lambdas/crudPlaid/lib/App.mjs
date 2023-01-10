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

    this.user = await this.ddbClient.getUserByTokenEmail(decrypted.email);
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

    await this.ddbClient.addPlaidItemToUser({
      email: this.user.email,
      tokenExchange,
      accounts,
      institution_id: this.payload.institution_id,
      institution_name: this.payload.institution_name,
    });

    return { accounts, item_id: tokenExchange.item_id };
  }

  async handleGetUserAccounts() {
    const { accounts } = await this.ddbClient.getUserAccounts(this.user.email);

    return { accounts };
  }

  async handleGetInstitutionById() {
    const data = await this.plaidClient.getInstitutionById(this.queryString.institution_id);

    return data;
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