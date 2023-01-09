import { GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import ddbClient from './utils/ddbClient.mjs';
import plaidClient from './utils/plaidClient.mjs';
import config from './utils/config.mjs';

// const keyPlaidItems = 'plaid_item';
// const keyTxCursor = 'tx_cursor';
// const keyTxAdded = 'tx_added';
// const keyTxModified = 'tx_modified';
// const keyTxRemoved = 'tx_removed';

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

    const { userId, email } = await ddbClient.getUserByTokenEmail(
      Authorization
    );

    switch (event.context['http-method']) {
      case 'PUT':
        if (body.path === config.path.transactionsSync) {
          const Item = {};
          // const { Item } = await ddbClient.send(
          //   new GetItemCommand({
          //     TableName: config.TableName,
          //     Key: { email: { S: token.email } },
          //   })
          // );
          // Provide a cursor from your database if you've previously
          // received one for the Item. Leave null if this is your
          // first sync call for this Item. The first request will
          // return a cursor.
          // let cursor = database.getLatestCursorOrNull(itemId);

          let cursor = Item[keyTxCursor]?.S || null;
          const { access_token } = JSON.parse(Item[keyPlaidItems]?.S)[0];

          console.log(cursor, access_token);

          // New transaction updates since "cursor"
          let added = [];
          let modified = [];
          // Removed transaction ids
          let removed = [];
          let hasMore = true;
          try {
            // Iterate through each page of new transaction updates for item
            while (hasMore) {
              const request = {
                access_token,
                cursor,
              };
              const response = await plaidClient.transactionsSync(request);
              const data = response.data;

              // Add this page of results
              added = added.concat(data.added);
              modified = modified.concat(data.modified);
              removed = removed.concat(data.removed);

              hasMore = data.has_more;

              // Update cursor to the next cursor
              cursor = data.next_cursor;
            }
          } catch (error) {
            // link error data to response and break out of procedure
            if (error.response?.data) {
              response = error.response.data;
              statusCode = error.response.status;
            } else {
              throw Error(error);
            }
            break;
          }

          // Persist cursor and updated data
          // database.applyUpdates(itemId, added, modified, removed, cursor);
          // console.log(added, modified, removed, cursor);

          await ddbClient.send(
            new UpdateItemCommand({
              TableName: config.TableName,
              Key: { email: { S: token.email } },
              UpdateExpression: `SET ${keyTxCursor} = :cursor, ${keyTxAdded} = :added, ${keyTxModified} = :modified, ${keyTxRemoved} = :removed`,
              ExpressionAttributeValues: {
                ':cursor': { S: cursor },
                ':added': { S: JSON.stringify(added) },
                ':modified': { S: JSON.stringify(modified) },
                ':removed': { S: JSON.stringify(removed) },
              },
              ReturnValues: 'ALL_NEW',
            })
          );
        }

        response = { tx_sync: 'complete' };
        break;
      case 'POST':
        if (body.path === config.path.linkTokenCreate) {
          const request = {
            user: { client_user_id: userId },
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
          let tokenExchange;

          try {
            //    response = { data: { access_token, user_id, request_id } }
            const response = await plaidClient.itemPublicTokenExchange({
              public_token: body.payload.public_token,
            });
            tokenExchange = response.data;
          } catch (error) {
            // link error data to response and break out of procedure
            if (error.response?.data) {
              response = error.response.data;
              statusCode = error.response.status;
            } else {
              throw Error(error);
            }
            break;
          }

          await ddbClient.addPlaidItemToUser(tokenExchange);

          response = { public_token_exchange: 'complete' };
        } else throw Error(`path:${body.path} not found!`);

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
