import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import config from './config.mjs';

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html#dynamodb-example-table-read-write-writing-an-item
const ddbClient = new DynamoDBClient({ region: config.awsRegion });

export default ddbClient;
