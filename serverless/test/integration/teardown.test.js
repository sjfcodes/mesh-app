/**
 * Tests Foo class
 *
 * @group teardown
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import { handler as tableHandler } from '../../lambdas/crudDynamoDbTable/index.js';
import {
  deleteUserTableRequest,
  deleteTransactionTableRequest,
} from './crudDynamoDbTable/requests.js';

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

describe('destroy tables', () => {
  it('should delete user table', async () => {
    const request = deleteUserTableRequest;
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
    expect(status_code).toBe(200);
  });
  it('should delete transaction table', async () => {
    const request = deleteTransactionTableRequest;
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
    expect(status_code).toBe(200);
  });
});
