import {
  convertToAttr,
  convertToNative,
  marshall,
  unmarshall,
} from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  BatchWriteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import config from '../utils/config.js';
import { splitListIntoSmallerLists } from '../utils/helpers.js';

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
        TableName: config.TableName.users,
        Key: { email: convertToAttr(email) },
        UpdateExpression: `SET #last = :date`,
        ExpressionAttributeNames: {
          '#last': config.property.lastActivity,
        },
        ExpressionAttributeValues: {
          ':date': { S: getTimestamp() },
        },
        ReturnValues: 'ALL_NEW',
      })
    );
  }

  /**
   *
   * @param {import('@aws-sdk/util-dynamodb').NativeAttributeValue} email
   * @param {string} requestPath
   * @returns
   */
  async readUserByTokenEmail(email, requestPath) {
    if (!email) throw new Error('missing argument email!');
    if (!requestPath) throw new Error('missing argument requestPath!');
    const { Item } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.users,
        Key: { email: convertToAttr(email) },
      })
    );

    /**
     * Get items is the first request our app makes.
     * This request will be responsible for
     * for getting user last activity.
     * Skip this check for said route.
     */
    if (requestPath !== config.path.item) {
      let shouldWriteUserLastActivity = false;
      const lastActivity = new Date(
        Item[config.property.lastActivity]?.S
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

    return unmarshall(Item);
  }

  /**
   *
   * @param {import('@aws-sdk/util-dynamodb').NativeAttributeValue} email
   * @param {string} itemId
   * @returns
   */
  async readItemByItemId(email, itemId) {
    if (!email) throw new Error('missing email!');
    if (!itemId) throw new Error('missing itemId!');

    const { Item } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.users,
        Key: { email: convertToAttr(email) },
        ProjectionExpression: `#items.#item`,
        ExpressionAttributeNames: {
          '#items': config.property.plaidItem,
          '#item': itemId,
        },
      })
    );

    const {
      [config.property.plaidItem]: { [itemId]: item },
    } = unmarshall(Item);

    return {
      accessToken: item.access_token,
      accounts: item.accounts,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      txCursor: item.tx_cursor,
    };
  }

  /**
   *
   * @param {import('@aws-sdk/util-dynamodb').NativeAttributeValue} email
   * @returns
   */
  async readUserItems(email) {
    if (!email) throw new Error('missing email!');
    const {
      Item: {
        [config.property.lastActivity]: { S: lastActivity },
        [config.property.plaidItem]: { M: plaidItems },
      },
    } = await this.client.send(
      new GetItemCommand({
        TableName: config.TableName.users,
        Key: { email: convertToAttr(email) },
        ProjectionExpression: `#items, #activity`,
        ExpressionAttributeNames: {
          '#items': config.property.plaidItem,
          '#activity': config.property.lastActivity,
        },
      })
    );

    return { items: plaidItems, lastActivity };
  }

  async readUserAccounts(email) {
    if (!email) throw new Error('missing email!');

    const { items } = await this.readUserItems(email);

    const allAccounts = Object.values(items).reduce((prev, curr) => {
      const parsed = convertToNative(curr);
      return [...prev, ...parsed.accounts];
    }, []);

    return { accounts: allAccounts };
  }

  /**
   *
   * @param {string} itemId
   * @param {string} accountId
   * @param {string} upperBand
   * @param {string} lowerBand
   * @returns
   */
  async readAccountTransactions(itemId, accountId, upperBand, lowerBand) {
    if (!itemId) throw new Error('missing itemId!');
    if (!accountId) throw new Error('missing accountId!');
    if (!upperBand) throw new Error('missing upperBand!');
    if (!lowerBand) throw new Error('missing lowerBand!');

    const formatted = itemId + '::' + accountId;

    const response = await this.client.send(
      new QueryCommand({
        TableName: config.TableName.transactions,
        IndexName: 'item_id-account_id-created_at-index',
        Select: 'ALL_ATTRIBUTES',
        KeyConditionExpression:
          '#partitionKey = :partitionValue AND #createdAt BETWEEN :lowerBand AND :upperBand',
        ExpressionAttributeNames: {
          '#partitionKey': PARTITION_KEY,
          '#createdAt': 'created_at',
        },
        ExpressionAttributeValues: {
          // @ts-ignore
          ':partitionValue': convertToAttr(formatted),
          // @ts-ignore
          ':lowerBand': convertToAttr(lowerBand),
          // @ts-ignore
          ':upperBand': convertToAttr(upperBand),
        },
      })
    );

    let transactions = [];

    if (response.Items?.length) {
      transactions = response.Items.map((tx) => unmarshall(tx));
    }

    return { transactions };
  }

  /**
   *
   * @param {string} email
   * @param {string} itemId
   * @param {string} newTxCursor
   * @returns
   */
  async writeUserItemTxCursor(email, itemId, newTxCursor) {
    if (!email || !itemId || newTxCursor === undefined)
      throw new Error('missing required arguments!');

    const now = getTimestamp();

    await this.client.send(
      new UpdateItemCommand({
        TableName: config.TableName.users,
        Key: { email: convertToAttr(email) },
        UpdateExpression: `SET #items.#item.#cursor = :cursor, #items.#item.#cursorUpdated = :cursorUpdated, #items.#item.#updated = :updated`,
        ExpressionAttributeNames: {
          '#items': config.property.plaidItem,
          '#item': itemId,
          '#cursor': config.property.txCursor,
          '#cursorUpdated': config.property.txCursorUpdatedAt,
          '#updated': 'updated_at',
        },
        ExpressionAttributeValues: {
          // @ts-ignore
          ':cursor': convertToAttr(newTxCursor),
          // @ts-ignore
          ':cursorUpdated': convertToAttr(now),
          // @ts-ignore
          ':updated': convertToAttr(now),
        },
        ReturnValues: 'UPDATED_NEW',
      })
    );
    return { tx_cursor_updated_at: now };
  }

  async writeUserPlaidItem({
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
        TableName: config.TableName.users,
        Key: { email: convertToAttr(email) },
        UpdateExpression: `SET #items.#item = :map`,
        ExpressionAttributeNames: {
          '#items': config.property.plaidItem,
          '#item': tokenExchange.item_id,
        },
        ExpressionAttributeValues: {
          ':map': convertToAttr({
            id: tokenExchange.item_id,
            access_token: tokenExchange.access_token,
            accounts: accounts,
            institution_name: institution_name,
            institution_id: institution_id,
            [config.property.txCursor]: '',
            [config.property.txCursorUpdatedAt]: '',
            created_at: now,
            updated_at: now,
          }),
        },
        ReturnValues: 'ALL_NEW',
      })
    );
  }

  async writeUserItemTransaction({ itemId, added, modified, removed }) {
    if (!itemId || !added || !modified || !removed) {
      throw new Error('missing required arguments!');
    }

    console.log(
      `writeUserItemTransaction(${JSON.stringify({
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
          [PARTITION_KEY]: `${itemId}::${tx.account_id}`,
          [SORT_KEY]: tx.transaction_id,
          transaction: tx,
          updated_at: now,
        };

        if (isNew) requestItem.created_at = tx.date || now;
        if (isRemoved) requestItem.transaction = 'removed';
        return { PutRequest: { Item: marshall(requestItem) } };
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
          RequestItems: { [config.TableName.transactions]: requestBatch },
        })
      );

      return response;
    };

    const requestQueue = splitListIntoSmallerLists(
      allRequests,
      config.dynamoDbBatchRequestLength
    );

    console.log(requestQueue)
    const responses = [];
    const loopCount = requestQueue.length;
    for (let i = 0; i < loopCount; i++) {
      const request = requestQueue.pop();
      const response = await batchWriteToTxTable(request);
      if (requestQueue.length) {
        console.log('pausing for 1000 ms');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      responses.push(response);
    }

    await Promise.all(responses);
  }
}

export default new DdbClient({ region: config.awsRegion });
