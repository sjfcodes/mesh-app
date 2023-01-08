import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import  config from "./utils/config.mjs";

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

const client = new DynamoDBClient({ region: config.region });

export const handler = async (event, context) => {
  let statusCode = 200;
  let response;
  let Command;

  const httpMethod = event.context["http-method"]
  try {
    switch (httpMethod) {
      case "DELETE":
        Command = DeleteItemCommand;
        break;
      case "GET":
        Command = GetItemCommand;
        break;
      case "POST":
        Command = UpdateItemCommand;
        break;
      case "PUT":
        Command = PutItemCommand;
        break;
      default:
        throw new Error(`Unsupported method "${httpMethod}"`);
    }
    response = await client.send(new Command(event.body.payload));
  } catch (err) {
    console.error(err);
    response = err.message;
    statusCode = 400;
  }

  return {
    body:response,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      "Content-Type": "application/json",
    },
    path: event.path,
    status_code: statusCode,
  };
};
