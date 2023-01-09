import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import config from './config.mjs';

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item
const ddbClient = new DynamoDBClient({ region: config.awsRegion });

class Client {
  constructor(ddbClient) {
    this.ddbClient = ddbClient;
    this.authEmail = ''
  }

  async getUserByTokenEmail(token) {
    // decode & parse jwt payload
    const payload = token.split('.')[1];
    const decrypted = JSON.parse(Buffer.from(payload, 'base64'));
    const {
      Item: { email, user_id },
    } = await this.ddbClient.send(
      new GetItemCommand({
        TableName: config.TableName,
        Key: { email: { S: decrypted.email } },
      })
    );

    this.email = email.S;
    return {
      userId: user_id.S,
      email: email.S,
    };
  }

  async addPlaidItemToUser(tokenExchange) {
    await this.ddbClient.send(
      new UpdateItemCommand({
        TableName: config.TableName,
        Key: { email: { S: this.email } },
        UpdateExpression: `SET #items.#item = :map`,
        ExpressionAttributeNames: {
          '#items': config.itemKeys.plaidItem,
          '#item': tokenExchange.item_id,
        },
        ExpressionAttributeValues: {
          ':map': {
            M: {
              access_token: { S: tokenExchange.access_token },
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

export default new Client(ddbClient);
