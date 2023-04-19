import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

import config from './utils/config.js';

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/globals.html
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

const client = new DynamoDBClient({ region: config.region });

export const handler = async (event) => {
  let statusCode = 200;
  let Command;
  let response;
  const httpMethod = event.context['http-method'];

  try {
    switch (httpMethod) {
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
        throw new Error(`Unsupported httpMethod "${httpMethod}"`);
    }

    response = await client.send(new Command(event.body.payload));
  } catch (err) {
    console.error(err);
    statusCode = 400;
    response = err.message;
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
