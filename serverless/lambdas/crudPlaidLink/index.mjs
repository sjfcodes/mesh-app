import { GetItemCommand } from "@aws-sdk/client-dynamodb";

import ddbClient from "./utils/ddbClient.mjs";
import plaidClient from "./utils/plaidClient.mjs";
import { config } from "./utils/config.mjs";

export const handler = async (event) => {
  let response = event.body;
  let statusCode = 200;
  try {
    const {
      httpMethod,
      path,
      headers: { Authentication },
    } = event;

    // decode & parse jwt payload
    const { email } = JSON.parse(
      Buffer.from(Authentication.split(".")[1], "base64")
    );

    switch (httpMethod) {
      case "POST":
        if (path === config.path.createLinkToken) {
          const { Item } = await ddbClient.send(
            new GetItemCommand({
              TableName: config.TableName,
              Key: { email: { S: email } },
            })
          );

          const request = {
            user: { client_user_id: Item.user_id.S },
            client_name: config.appName,
            products: ["auth"],
            language: "en",
            // webhook: "https://webhook.example.com",
            country_codes: ["US"],
          };

          const { data } = await plaidClient.linkTokenCreate(request);
          // return data to caller
          response = data;
        }

        break;
      default:
        throw new Error(`Unsupported method: "${event.httpMethod}"`);
    }
  } catch (error) {
    console.error(error);
    statusCode = 400;
    response = error.message;
  }

  return {
    body: response,
    path: event.path,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      "Content-Type": "application/json",
    },
    httpMethod: event.httpMethod,
    statusCode,
  };
};

// https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
// https://cognito-idp.us-east-1.amazonaws.com/us-east-1_MmpeiDLFc/.well-known/jwks.json
