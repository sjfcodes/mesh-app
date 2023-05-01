/**
 * @group db/item/create
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import { handler as tableHandler } from '../../../../lambdas/ddbTable/index.js';
import { addUserRequest, addUserItemRequest } from './requests.js';

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

const mockApiGwTransformations = (request) => ({
  ...request,
  body: JSON.stringify(request.body),
});

const handleError = (err) => {
  let message = err.data || err.response?.data || err;
  console.error(message);
};

describe('create, edit, & delete items from table', () => {
  it('should add user', async () => {
    const request = addUserRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : tableHandler(mockApiGwTransformations(request)));
    const {
      body: { statusCode },
    } = response;
    if (statusCode !== 200) console.error(response);
    expect(statusCode).toBe(200);
  });

  // it.only('should add Item to user', async () => {
  //   const request = addUserItemRequest;
  //   const response = await (testApi
  //     ? api({
  //         url: request.path,
  //         method: request.httpMethod,
  //         data: request.body,
  //       })
  //         .then(({ data }) => data)
  //         .catch(handleError)
  //     : tableHandler(mockApiGwTransformations(request)));
  //   const {
  //     body: { statusCode },
  //   } = response;
  //   if (statusCode !== 200) console.error(response);
  //   expect(statusCode).toBe(200);
  // });

  it.only('should add plaid item to user with mocked token exchange', async () => {
    const request = mockExchangeTokenLinkRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : plaidHandler(mockApiGwTransformations(request)));

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
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : plaidHandler(mockApiGwTransformations(request)));

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
