import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import config from '../utils/config.mjs';

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

class DdbClient {
  constructor(configuration) {
    this.client = new DynamoDBClient(configuration);
  }

  async getUserByTokenEmail(email) {
    if (!email) throw new Error('missing required arguments!');
    const { Item } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
      })
    );

    return {
      userId: Item.user_id.S,
      email: Item.email.S,
      plaid_item: Item.plaid_item.M,
    };
  }

  async getItemByItemId(email, itemId) {
    if (!email || !itemId) throw new Error('missing required arguments!');

    const {
      Item: {
        [config.itemKeys.plaidItem]: {
          M: {
            [itemId]: {
              M: { access_token, accounts, created_at, updated_at, tx_cursor },
            },
          },
        },
      },
    } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        ProjectionExpression: `#items.#item`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
          '#item': itemId,
        },
      })
    );

    return {
      accessToken: access_token.S,
      accounts: JSON.parse(accounts.S),
      createdAt: created_at.S,
      updatedAt: updated_at.S,
      txCursor: tx_cursor.S,
    };
  }

  async getUserAccounts(email) {
    const {
      Item: {
        [config.itemKeys.plaidItem]: { M: plaidItems },
      },
    } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        ProjectionExpression: `#items`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
        },
      })
    );

    const allAccounts = Object.values(plaidItems).reduce((prev, curr) => {
      const accounts = JSON.parse(curr.M.accounts.S);
      return [...prev, ...accounts];
    }, []);

    return { accounts: allAccounts };
  }

  async setItemTxCursor(email, itemId, newTxCursor) {
    if (!email || !itemId || newTxCursor === undefined)
      throw new Error('missing required arguments!');
    const { Attributes } = await this.client.send(
      new UpdateItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        UpdateExpression: `SET #items.#item.#cursor = :cursor, #items.#item.#updated = :updated`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
          '#item': itemId,
          '#cursor': config.itemKeys.txCursor,
          '#updated': 'updated_at',
        },
        ExpressionAttributeValues: {
          ':cursor': { S: newTxCursor },
          ':updated': { S: new Date().toISOString() },
        },
        ReturnValues: 'UPDATED_NEW',
      })
    );
  }

  async addPlaidItemToUser({ email, tokenExchange, accounts, institution_id, institution_name }) {
    if (!email || !tokenExchange || !accounts)
      throw new Error('missing required arguments!');

    await this.client.send(
      new UpdateItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        UpdateExpression: `SET #items.#item = :map`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
          '#item': tokenExchange.item_id,
        },
        ExpressionAttributeValues: {
          ':map': {
            M: {
              access_token: { S: tokenExchange.access_token },
              accounts: { S: JSON.stringify(accounts) },
              institution_name: { S: institution_name },
              institution_id: { S: institution_id },
              [config.itemKeys.txCursor]: { S: '' },
              created_at: { S: new Date().toISOString() },
              updated_at: { S: new Date().toISOString() },
            },
          },
        },
        ReturnValues: 'ALL_NEW',
      })
    );
  }
}

export default new DdbClient({ region: config.awsRegion });
