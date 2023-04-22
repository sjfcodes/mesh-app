/**
 * Tests Foo class
 *
 * @group setup
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import dynamoDb from '../config/dynamoDb.js';

import { handler as tableHandler } from '../../lambdas/crudDynamoDbTable/index.js';
import {
  createUserTableRequest,
  createTransactionTableRequest,
} from './crudDynamoDbTable/requests.js';

dotenv.config();
const { TableName } = dynamoDb;
const testApi = process.env.USE_API_GATEWAY === 'true';

const api = axios.create({
  baseURL: process.env.AWS_API_GATEWAY,
  headers: { Authorization: process.env.AUTH_TOKEN },
});

console.log(`TESTING: ${testApi ? 'AWS_API_GATEWAY' : 'LOCAL'}`);

const handleError = (err) => {
  let message = err.data || err.response?.data || err;
  console.error(message);
};

describe('create tables', () => {
  it('should create user table', async () => {
    const request = createUserTableRequest;
    const response = await (testApi
      ? api({
          url: request.context['resource-path'],
          method: request.context['http-method'],
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : tableHandler(request));

    const { status_code, body } = response;
    if (status_code !== 200) console.error(response);
    await new Promise((resolve) => setTimeout(resolve, 8000));
    expect(status_code).toBe(200);
    expect(body.TableDescription.TableName).toBe(TableName.user);
  });

  it('should create transaction table', async () => {
    const request = createTransactionTableRequest;
    const response = await (testApi
      ? api({
          url: request.context['resource-path'],
          method: request.context['http-method'],
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : tableHandler(request));

    const { status_code, body } = response;
    if (status_code !== 200) console.error(response);

    await new Promise((resolve) => setTimeout(resolve, 8000));
    expect(status_code).toBe(200);
    expect(body.TableDescription.TableName).toBe(TableName.transaction);
    // pause to let tables create
    console.log('pause for 5000ms after tables create');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });
});
