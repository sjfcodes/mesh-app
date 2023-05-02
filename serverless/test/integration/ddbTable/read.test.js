/**
 * @group db/read
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import { handler as tableHandler } from '../../../lambdas/ddbTable/index.js';
import {
  getUserTableRequest,
  getTransactionTableRequest,
} from './requests.js';
import { handleAxiosError } from '../../utils/helpers.js';

dotenv.config();
const testApi = process.env.USE_API_GATEWAY === 'true';

const api = axios.create({
  baseURL: process.env.AWS_API_GATEWAY,
  headers: { Authorization: process.env.AUTH_TOKEN },
});

console.log(`TESTING: ${testApi ? 'AWS_API_GATEWAY' : 'LOCAL'}`);

describe('read tables', () => {
  it('should get user table', async () => {
    const request = getUserTableRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : tableHandler(request));

    const { body } = response;
    if (body.statusCode !== 200) console.error(response);

    expect(body.statusCode).toBe(200);
  });

  it('should get transaction table', async () => {
    const request = getTransactionTableRequest;
    const response = await (testApi
      ? api({
          url: request.event.path,
          method: request.event.httpMethod,
          data: request.event.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : tableHandler(request));

    const { body } = response;
    if (body.statusCode !== 200) console.error(response);

    expect(body.statusCode).toBe(200);
  });
});
