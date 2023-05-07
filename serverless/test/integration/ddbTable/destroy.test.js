/**
 * @group db/item/destroy
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import { handler as tableItemHandler } from '../../../lambdas/ddbTable/index';
import { deleteTableItemRequest } from './requests.js';
import { handleAxiosError } from '../../utils/helpers.js';
import config from '../../config/dynamoDb';

dotenv.config();
const testApi = config.targetApiUrl;


const api = axios.create({
  baseURL: testApi,
  headers: { Authorization: process.env.AUTH_TOKEN },
});

console.log(`TESTING: ${testApi ? 'AWS_API_GW_DEV' : 'LOCAL'}`);

describe('create, edit, & delete items from table', () => {
  it('should DELETE item from Table', async () => {
    const request = deleteTableItemRequest;
    const response = await (testApi
      ? api({
          url: request.event.path,
          method: request.event.httpMethod,
          data: request.event.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : tableItemHandler(request));
    const { body } = response;
    if (body.statusCode !== 200) console.error(response);
    expect(body.statusCode).toBe(200);
  });
});
