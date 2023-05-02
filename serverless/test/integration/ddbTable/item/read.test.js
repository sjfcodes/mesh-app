/**
 * @group db/item/read
 */
import * as dotenv from 'dotenv';
import axios from 'axios';

import dynamoDb from '../../../config/dynamoDb.js';
import mockData from '../../plaid/mockData/plaid.js';

import { handler as ddbHandler } from '../../../../lambdas/ddbTable/index.js';
import { handler as plaidHandler } from '../../../../lambdas/plaid/index.js';
import { getTableItemRequest, updateTableItemRequest } from './requests.js';

import {
  getInstitutionByIdRequest,
  getUserAccountsRequest,
  getTransactionsForAccountWithBandsRequest,
  getTransactionsForAccountWithoutBandsRequest,
  getUserItemsRequest,
  // getUserAccountsBalancesRequest,
} from '../../plaid/requests.js';
import {
  handleAxiosError,
  mockApiGwRequestTransformations,
  parseLambdaResponse,
} from '../../../utils/helpers.js';

dotenv.config();
const { Item } = dynamoDb;
const testApi = process.env.USE_API_GATEWAY === 'true';

const api = axios.create({
  baseURL: process.env.AWS_API_GATEWAY,
  headers: { Authorization: process.env.AUTH_TOKEN },
});

console.log(`TESTING: ${testApi ? 'AWS_API_GATEWAY' : 'LOCAL'}`);

describe('create, edit, & delete items from table', () => {
  it('should get table item', async () => {
    const request = getTableItemRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : ddbHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.data?.statusCode !== 200) console.error(response);

    expect(body.statusCode).toBe(200);
    expect(
      body.data?.Item.plaid_item.M[mockData.tokenExchange.item_id].M.id.S
    ).toBe(mockData.tokenExchange.item_id);
    expect(
      body.data?.Item.plaid_item.M[mockData.tokenExchange.item_id].M
        .institution_name.S
    ).toBe(mockData.institutionName);
  });

  it('should update table item with existing properties', async () => {
    const request = updateTableItemRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : ddbHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.statusCode !== 200) console.error(response);

    expect(body.statusCode).toBe(200);
    // expect unchanged
    expect(body.data?.Attributes.email.S).toBe(Item.original.email);
    // expect changed
    expect(body.data?.Attributes.verified.BOOL).toBe(true);
  });

  it('should get plaid items for one user', async () => {
    const request = getUserItemsRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : plaidHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.statusCode !== 200) console.error(response);

    const item = Object.values(body.data?.items)[0];

    expect(body.statusCode).toBe(200);
    expect(body.data?.last_activity).not.toBe(undefined);
    expect(item).not.toHaveProperty('access_token');
    expect(item).toHaveProperty('accounts');
    expect(item).toHaveProperty('created_at');
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('institution_id');
    expect(item).toHaveProperty('institution_name');
    expect(item).toHaveProperty('tx_cursor');
    expect(item).toHaveProperty('tx_cursor_updated_at');
    expect(item).toHaveProperty('updated_at');
    expect(Array.isArray(item.accounts)).toBe(true);
  });

  it('should get plaid item accounts for user', async () => {
    const request = getUserAccountsRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : plaidHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.statusCode !== 200) console.error(response);

    expect(body.statusCode).toBe(200);
    expect(body.data?.accounts.length).toBeGreaterThan(0);
  });

  /**
   * TODO: how to overcome plaid error for this test?
   *
   * data: {
   *   display_message: null,
   *   error_code: 'ITEM_LOGIN_REQUIRED',
   *   error_message: "the login details of this item have changed (credentials, MFA, or required user action) and a user login is required to update this information. use Link's update mode to restore the item to a good state",
   *   error_type: 'ITEM_ERROR',
   *   request_id: '3Nr4kWFx69s8tez',
   *   suggested_action: null
   * }
   */
  // it('should get plaid item account balances for user', async () => {
  //   const request = getUserAccountsBalancesRequest;
  //   const response = await (testApi
  //     ? api({
  //         url: request.path,
  //         method: request.httpMethod,
  //         data: request.body,
  //       })
  //         .then(({ data }) => data)
  //         .catch(handleAxiosError)
  //     : plaidHandler(request));

  //   const body = parseLambdaResponse(testApi, response);
  //   if (body.statusCode !== 200) console.error(response);
  //   expect(body.statusCode).toBe(200);
  //   expect(Array.isArray(body.data?.account)).toBe(true);

  //   const account = Object.values(body.data?.account)[0];
  //   expect(account.balances.available).toBeGreaterThan(0);
  // });

  it('should get plaid item account transactions', async () => {
    const request = getTransactionsForAccountWithBandsRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          params: request.queryStringParameters,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : plaidHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.statusCode !== 200) console.error(response);
    expect(body.statusCode).toBe(200);
    expect(body.data?.transactions?.length).toBe(3);

    const transaction = body.data?.transactions[0];
    expect(transaction).toHaveProperty('created_at');
    expect(transaction).toHaveProperty('updated_at');
    expect(transaction).toHaveProperty('transaction_id');
    expect(transaction).toHaveProperty('item_id::account_id');
    expect(transaction).toHaveProperty('transaction');
    expect(typeof transaction.created_at === 'string').toBe(true);
    expect(typeof transaction.updated_at === 'string').toBe(true);
    expect(typeof transaction.transaction_id === 'string').toBe(true);
    expect(typeof transaction['item_id::account_id'] === 'string').toBe(true);
    expect(typeof transaction.transaction === 'object').toBe(true);
    expect(Object.keys(transaction.transaction).length).toBe(23);
  });

  it('should get plaid item account transactions for last 30 days when no upperBand & lowerBand provided', async () => {
    const request = getTransactionsForAccountWithoutBandsRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          params: request.queryStringParameters,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : plaidHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.statusCode !== 200) console.error(response);
    expect(body.statusCode).toBe(200);
    expect(body.data?.transactions?.length).toBe(0);

    const transaction = body.data?.transactions[0];
    if (transaction) {
      expect(transaction).toHaveProperty('created_at');
      expect(transaction).toHaveProperty('updated_at');
      expect(transaction).toHaveProperty('transaction_id');
      expect(transaction).toHaveProperty('item_id::account_id');
      expect(transaction).toHaveProperty('transaction');
      expect(typeof transaction.created_at === 'string').toBe(true);
      expect(typeof transaction.updated_at === 'string').toBe(true);
      expect(typeof transaction.transaction_id === 'string').toBe(true);
      expect(typeof transaction['item_id::account_id'] === 'string').toBe(true);
      expect(typeof transaction.transaction === 'object').toBe(true);
      expect(Object.keys(transaction.transaction).length).toBe(23);
    }
  });

  it('should get bank institution details by id institution_id', async () => {
    const request = getInstitutionByIdRequest;
    const response = await (testApi
      ? api({
          url: request.path,
          method: request.httpMethod,
          params: request.queryStringParameters,
          data: request.body,
        })
          .then(({ data }) => data)
          .catch(handleAxiosError)
      : plaidHandler(mockApiGwRequestTransformations(request)));

    const body = parseLambdaResponse(testApi, response);
    if (body.statusCode !== 200) console.error(response);

    expect(body.statusCode).toBe(200);
    expect(body.data?.logo).not.toBe(null);
  });
});
