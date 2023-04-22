/**
 * Tests Foo class
 *
 * @group db/item/destroy
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import { handler as tableItemHandler } from '../../../lambdas/crudDynamoDbTableItem/index.js';
import { deleteTableItemRequest } from './requests.js';

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
  it('should DELETE item from Table', async () => {
    const request = deleteTableItemRequest;
    const response = await (testApi
      ? api({
          url: request.context['resource-path'],
          method: request.context['http-method'],
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleError)
      : tableItemHandler(request));
    const { status_code, body } = response;
    if (status_code !== 200) console.error(response);
    expect(status_code).toBe(200);
  });
});
