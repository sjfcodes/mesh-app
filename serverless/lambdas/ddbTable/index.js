import {
  DynamoDBClient,
  // /table
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  // /table/item
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';

import config from './utils/config.js';

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/globals.html
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

const client = new DynamoDBClient({ region: config.region });

export const handler = async (event) => {
  const requestMethod = event.requestMethod;
  const requestPath = event.path;

  let response = {
    message: 'default',
    body: {},
  };

  console.log(event);

  let statusCode = 200;
  let Command;

  try {
    switch (requestPath) {
      case '/table':
        switch (requestMethod) {
          case 'DELETE':
            Command = DeleteTableCommand;
            break;
          case 'GET':
            Command = DescribeTableCommand;
            break;
          case 'PUT':
            Command = CreateTableCommand;
            break;
          default:
            throw new Error(`Unsupported method "${requestMethod}"`);
        }

        response.body = await client.send(new Command(event.body.payload));
        break;

      case '/table/item':
        switch (requestMethod) {
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
            throw new Error(`Unsupported method "${requestMethod}"`);
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
              event.body.payload.ExpressionAttributeValues[key] =
                marshall(value);
            }
          );
        }

        response = await client.send(new Command(event.body.payload));
        break;

      default:
        throw new Error(`Unsupported path: "${requestPath}"`);
    }

    response.message = 'success';
  } catch (error) {
    console.error(error);
    response.message = error.message;
    statusCode = 500;
  }

  return {
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Content-Type': 'application/json',
    },
    statusCode,
  };
};
