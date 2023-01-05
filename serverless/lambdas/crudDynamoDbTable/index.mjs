import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import { config } from "./utils/config.mjs";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/globals.html
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

const client = new DynamoDBClient({ region: config.region });

export const handler = async (event) => {
  //   console.log("Received event:", JSON.stringify(event, null, 2));

  let body;
  let Command;
  let statusCode = 200;
  const httpMethod = event.httpMethod || "method not provided";
  const headers = { "Content-Type": "application/json" };

  try {
    switch (event.httpMethod) {
      case "DELETE":
        Command = DeleteTableCommand;
        break;
      case "GET":
        Command = DescribeTableCommand;
        break;
      case "PUT":
        Command = CreateTableCommand;
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
    body = await client.send(new Command(event.body));
  } catch (err) {
    console.error(err);
    statusCode = 400;
    body = err.message;
  }

  return {
    statusCode,
    body,
    headers,
    httpMethod,
  };
};
