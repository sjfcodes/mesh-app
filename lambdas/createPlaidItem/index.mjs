import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item

const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
export const handler = async (event, context) => {
//   console.log("Received event:", JSON.stringify(event, null, 2));

  let body = {};
  let statusCode = 200;
  const httpMethod = event.httpMethod || "method not provided";
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.httpMethod) {
      case "DELETE":
        // body = await dynamo.delete(JSON.parse(event.body)).promise();
        break;
      case "GET":
        body = await client.send(new GetItemCommand(event.body));
        break;
      case "POST":
        body = await client.send(new UpdateItemCommand(event.body));
        break;
      case "PUT":
        body = await client.send(new PutItemCommand(event.body));
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
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
