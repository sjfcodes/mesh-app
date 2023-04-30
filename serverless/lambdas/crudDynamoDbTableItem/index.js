import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

import config from './utils/config.js';

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

const client = new DynamoDBClient({ region: config.region });

export const handler = async (event, context) => {
  let statusCode = 200;
  let response;
  let Command;

  const httpMethod = event.httpMethod;
  try {
    switch (httpMethod) {
      case 'DELETE':
        Command = DeleteItemCommand;
        break;

      case 'GET':
        Command = GetItemCommand;
        break;

      case 'POST':
        Command = UpdateItemCommand;
        break;

      case 'PUT':
        Command = PutItemCommand;
        break;

      default:
        throw new Error(`Unsupported method "${httpMethod}"`);
    }

    if (event.body.payload.Item) {
      event.body.payload.Item = marshall(event.body.payload.Item);
    }

    if (event.body.payload.Key) {
      event.body.payload.Key = marshall(event.body.payload.Key);
    }

    if (event.body.payload.ExpressionAttributeValues) {
      Object.entries(event.body.payload.ExpressionAttributeValues).forEach(
        ([key, value]) => {
          event.body.payload.ExpressionAttributeValues[key] = marshall(value);
        }
      );
    }

    response = await client.send(new Command(event.body.payload));
  } catch (err) {
    console.error(err);
    response = err.message;
    statusCode = 400;
  }

  return {
    body: response,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Content-Type': 'application/json',
    },
    path: event.path,
    status_code: statusCode,
  };
};
