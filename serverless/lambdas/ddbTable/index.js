import { marshall } from '@aws-sdk/util-dynamodb';
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
  const requestMethod = event.httpMethod;
  const requestPath = event.path;
  const requestBody = event.body ? JSON.parse(event.body) : {};

  let queryStringParameters = event.queryStringParameters;
  if (typeof queryStringParameters === 'string') {
    queryStringParameters = JSON.parse(queryStringParameters);
  }

  let response = {};

  console.log('event', event);

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

        response = await client.send(new Command(requestBody));
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

        const commandInput = {};

        if (requestBody.TableName) {
          commandInput.TableName = requestBody.TableName;
        }
        if (queryStringParameters.TableName) {
          commandInput.TableName = queryStringParameters.TableName;
        }

        if (requestBody.Item) {
          commandInput.Item = marshall(requestBody.Item);
        }
        if (queryStringParameters.Item) {
          commandInput.Item = marshall(queryStringParameters.Item);
        }

        if (requestBody.Key) {
          commandInput.Key = marshall(requestBody.Key);
        }
        if (queryStringParameters.Key && queryStringParameters.Value) {
          commandInput.Key = marshall({
            [queryStringParameters.Key]: queryStringParameters.Value,
          });
        }

        if (requestBody.ExpressionAttributeValues) {
          Object.entries(requestBody.ExpressionAttributeValues).forEach(
            ([key, value]) => {
              commandInput.ExpressionAttributeValues[key] = marshall(value);
            }
          );
        }
        if (queryStringParameters.ExpressionAttributeValues) {
          Object.entries(
            queryStringParameters.ExpressionAttributeValues
          ).forEach(([key, value]) => {
            commandInput.ExpressionAttributeValues[key] = marshall(value);
          });
        }

        response.data = await client.send(new Command(commandInput));
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

  response.statusCode = statusCode;

  // must follow expected formatted response
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
