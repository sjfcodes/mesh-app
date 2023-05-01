/**
 * @group db/item/create
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import { handler as tableHandler } from '../../../../lambdas/ddbTable/index.js';
import { createTableUserRequest, createTableItemRequest } from './requests.js';

import { handler as plaidHandler } from '../../../../lambdas/plaid/index.js';
import {
  mockExchangeTokenLinkRequest,
  mockSyncTransactionsForItemRequest,
} from '../../plaid/requests.js';

dotenv.config();
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

describe('create, edit, & delete items from table', () => {
  it.only('should create user', async () => {
    const request = createTableUserRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : tableHandler({ ...request, body: JSON.stringify(request.body) }));
    const { statusCode } = response;
    if (statusCode !== 200) console.error(response);
    expect(statusCode).toBe(200);
  });

  it('should create Item', async () => {
    const request = createTableItemRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : tableHandler(request));
    const { statusCode } = response;
    if (statusCode !== 200) console.error(response);
    expect(statusCode).toBe(200);
  });

  it('should add new plaid item with mocked token exchange', async () => {
    const request = mockExchangeTokenLinkRequest;
    const response = await (testApi
      ? api({
          url: request.event.path,
          method: request.event.httpMethod,
          data: request.event.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : plaidHandler(request));

    const { statusCode, body } = response;
    if (statusCode !== 200) console.error(response);

    expect(statusCode).toBe(200);
    expect(body.public_token_exchange).toBe('complete');
    console.log('pause for 2000ms after mock item create');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it('should simulate item sync & write transactions to db', async () => {
    const request = mockSyncTransactionsForItemRequest;
    const response = await (testApi
      ? api({
          url: request.event.path,
          method: request.event.httpMethod,
          data: request.event.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : plaidHandler(request));

    const { statusCode, body } = response;
    if (statusCode !== 200) console.error(response);

    expect(statusCode).toBe(200);
    expect(body.tx_sync).toBe('complete');
    expect(body.tx_cursor_updated_at).not.toBe(undefined);
    expect(body.added).toBeGreaterThan(0);
    console.log('pause for 2000ms after tx sync');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
});
