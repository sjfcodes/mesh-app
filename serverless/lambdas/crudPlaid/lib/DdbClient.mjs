import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  BatchWriteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import config from '../utils/config.mjs';
import { splitListIntoSmallerLists } from '../utils/helpers.mjs';

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item
const PARTITION_KEY = 'item_id::account_id';
const SORT_KEY = 'transaction_id';

const getTimestamp = () => new Date().toISOString();

class DdbClient {
  constructor(configuration) {
    this.client = new DynamoDBClient(configuration);
  }

  async writeUserLastActivity(email) {
    if (!email) throw new Error('missing argument email!');
    await this.client.send(
      new UpdateItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        UpdateExpression: `SET #last = :date`,
        ExpressionAttributeNames: {
          '#last': config.itemKeys.lastActivity,
        },
        ExpressionAttributeValues: {
          ':date': { S: getTimestamp() },
        },
        ReturnValues: 'ALL_NEW',
      })
    );
  }

  async readUserByTokenEmail(email, requestPath) {
    if (!email) throw new Error('missing argument email!');
    if (!requestPath) throw new Error('missing argument requestPath!');
    const { Item } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
      })
    );

    /**
     * Get items is the first request our app makes.
     * This request will be responsible for
     * for getting user last activity.
     * Skip this check for said route.
     */
    if (requestPath !== config.path.getItems) {
      let shouldWriteUserLastActivity = false;
      const lastActivity = new Date(
        Item[config.itemKeys.lastActivity].S
      ).getTime();

      if (!isNaN(lastActivity)) {
        const currentTime = new Date().getTime();
        if (currentTime - lastActivity > 5000) {
          shouldWriteUserLastActivity = true;
        }
      } else {
        shouldWriteUserLastActivity = true;
      }

      if (shouldWriteUserLastActivity) {
        await this.writeUserLastActivity(email);
      }
    }

    return {
      userId: Item.user_id.S,
      email: Item.email.S,
      plaid_item: Item.plaid_item.M,
    };
  }

  async readItemByItemId(email, itemId) {
    if (!email) throw new Error('missing email!');
    if (!itemId) throw new Error('missing itemId!');
    console.log(`readItemByItemId(${email}, ${itemId})`);
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

  async readUserItems(email) {
    if (!email) throw new Error('missing email!');
    const {
      Item: {
        [config.itemKeys.lastActivity]: { S: lastActivity },
        [config.itemKeys.plaidItem]: { M: plaidItems },
      },
    } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        ProjectionExpression: `#items, #activity`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
          '#activity': config.itemKeys.lastActivity,
        },
      })
    );

    return { items: plaidItems, lastActivity };
  }

  async readUserAccounts(email) {
    if (!email) throw new Error('missing email!');

    const { items } = await this.readUserItems(email);

    const allAccounts = Object.values(items).reduce((prev, curr) => {
      const accounts = JSON.parse(curr.M.accounts.S);
      return [...prev, ...accounts];
    }, []);

    return { accounts: allAccounts };
  }

  async readAccountTransactions(itemId, accountId) {
    if (!itemId) throw new Error('missing itemId!');
    if (!accountId) throw new Error('missing accountId!');

    const formatted = itemId + '::' + accountId;

    const response = await this.client.send(
      new QueryCommand({
        TableName: config.TableName.transaction,
        KeyConditionExpression: '#partitionKey = :partitionKey',
        ExpressionAttributeNames: {
          '#partitionKey': PARTITION_KEY,
        },
        ExpressionAttributeValues: {
          ':partitionKey': { S: formatted },
        },
      })
    );
    return { transactions: response.Items };
  }

  async readAccountTransaction(itemId, accountId, transactionId) {
    if (!itemId) throw new Error('missing itemId!');
    if (!accountId) throw new Error('missing accountId!');
    if (!transaction) throw new Error('missing transaction!');

    const formatted = itemId + '::' + accountId;
    const response = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.transaction,
        Key: {
          [PARTITION_KEY]: { S: formatted },
          [SORT_KEY]: { S: transactionId },
        },
      })
    );

    return { transaction: {} };
  }

  async writeItemTxCursor(email, itemId, newTxCursor) {
    if (!email || !itemId || newTxCursor === undefined)
      throw new Error('missing required arguments!');

    console.log(`writeItemTxCursor(${email}, ${itemId}, ${newTxCursor})`);

    const now = getTimestamp();

    await this.client.send(
      new UpdateItemCommand({
        TableName: config.TableName.user,
        Key: { email: { S: email } },
        UpdateExpression: `SET #items.#item.#cursor = :cursor, #items.#item.#cursorUpdated = :cursorUpdated, #items.#item.#updated = :updated`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
          '#item': itemId,
          '#cursor': config.itemKeys.txCursor,
          '#cursorUpdated': config.itemKeys.txCursorUpdatedAt,
          '#updated': 'updated_at',
        },
        ExpressionAttributeValues: {
          ':cursor': { S: newTxCursor },
          ':cursorUpdated': { S: now },
          ':updated': { S: now },
        },
        ReturnValues: 'UPDATED_NEW',
      })
    );
    return { tx_cursor_updated_at: now };
  }

  async writePlaidItemToUser({
    email,
    tokenExchange,
    accounts,
    institution_id,
    institution_name,
  }) {
    if (!email || !tokenExchange || !accounts)
      throw new Error('missing required arguments!');

    const now = getTimestamp();

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
              id: { S: tokenExchange.item_id },
              access_token: { S: tokenExchange.access_token },
              accounts: { S: JSON.stringify(accounts) },
              institution_name: { S: institution_name },
              institution_id: { S: institution_id },
              [config.itemKeys.txCursor]: { S: '' },
              [config.itemKeys.txCursorUpdatedAt]: { S: '' },
              created_at: { S: now },
              updated_at: { S: now },
            },
          },
        },
        ReturnValues: 'ALL_NEW',
      })
    );
  }

  async writeTxsForItem({ itemId, added, modified, removed }) {
    if (
      !itemId ||
      added === undefined ||
      modified === undefined ||
      removed === undefined
    )
      throw new Error('missing required arguments!');
    console.log(
      `writeTxsForItem(${JSON.stringify({
        itemId,
        added: added.length,
        modified: modified.length,
        removed: removed.length,
      })})`
    );

    const now = getTimestamp();

    const formatTxs = (array, { isNew = false, isRemoved = false } = {}) => {
      if (array === undefined) throw new Error('missing transaction array');
      if (array.length === 0) return [];

      return array.map((tx) => {
        const requestItem = {
          [PARTITION_KEY]: { S: `${itemId}::${tx.account_id}` },
          [SORT_KEY]: { S: tx.transaction_id },
          transaction: { S: JSON.stringify(tx) },
          updated_at: { S: now },
        };

        if (isNew) requestItem.created_at = { S: now };
        if (isRemoved) requestItem.transaction = { S: 'removed' };

        return { PutRequest: { Item: requestItem } };
      });
    };

    const allRequests = [
      ...formatTxs(added, { isNew: true }),
      ...formatTxs(modified),
      ...formatTxs(removed, { isRemoved: true }),
    ];

    const batchWriteToTxTable = async (requestBatch) => {
      if (!requestBatch.length) return;

      const response = await this.client.send(
        new BatchWriteItemCommand({
          RequestItems: { [config.TableName.transaction]: requestBatch },
        })
      );

      return response;
    };

    const requestQueue = splitListIntoSmallerLists(
      allRequests,
      config.dynamoDbBatchRequestLength
    );
    const responses = [];
    for (let i = 0; i < requestQueue.length; i++) {
      const request = requestQueue.pop();
      const response = await batchWriteToTxTable(request);
      if (requestQueue.length) {
        console.log('pausing for 3000 ms');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      responses.push(response);
    }

    await Promise.all(responses);
  }
}

export default new DdbClient({ region: config.awsRegion });
