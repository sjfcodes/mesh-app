import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import ddbClient from './utils/ddbClient.mjs';
import plaidClient from './utils/plaidClient.mjs';
import config from './utils/config.mjs';

export const handler = async (event) => {
  let response = event.body;
  let statusCode = 200;
  try {
    const {
      body,
      params: {
        header: { Authorization },
      },
    } = event;

    // decode & parse jwt payload
    const token = JSON.parse(
      Buffer.from(Authorization.split('.')[1], 'base64')
    );

    switch (event.context['http-method']) {
      case 'POST':
        if (body.path === config.path.linkTokenCreate) {
          const {
            Item: {
              user_id: { S: client_user_id },
            },
          } = await ddbClient.send(
            new GetItemCommand({
              TableName: config.TableName,
              Key: { email: { S: token.email } },
            })
          );

          const request = {
            user: { client_user_id },
            client_name: config.appName,
            products: ['auth'],
            language: 'en',
            // webhook: "https://webhook.example.com",
            country_codes: ['US'],
          };

          const { data } = await plaidClient.linkTokenCreate(request);
          // return data to caller
          response = data;
        } else if (body.path === config.path.linkTokenExchange) {
          const result = await ddbClient.send(
            new UpdateItemCommand({
              TableName: config.TableName,
              Key: { email: { S: token.email } },
              UpdateExpression: 'SET plaidItems = :val',
              ExpressionAttributeValues: {
                ':val': { S: JSON.stringify(body.payload) },
              },
              ReturnValues: 'ALL_NEW', //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/enums/returnvalue.html
            })
          );

          response = result;
        } else {
          throw Error(`path:${body.path} not found!`);
        }

        break;
      default:
        throw new Error(`Unsupported method: "${event.httpMethod}"`);
    }
  } catch (error) {
    console.error(error);
    response = error.message;
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

// https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
// https://cognito-idp.us-east-1.amazonaws.com/us-east-1_MmpeiDLFc/.well-known/jwks.json
