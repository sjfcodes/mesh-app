import * as dotenv from 'dotenv';
import axios from 'axios';

import dynamoDb from '../config/dynamoDb.mjs';
import mockData from './crudPlaid/mockData/plaid.js';

import { handler as tableHandler } from '../../lambdas/crudDynamoDbTable/index.mjs';
import {
  getUserTableRequest,
  createUserTableRequest,
  deleteUserTableRequest,
  deleteTransactionTableRequest,
  createTransactionTableRequest,
  getTransactionTableRequest,
} from './crudDynamoDbTable/requests.mjs';

import { handler as tableItemHandler } from '../../lambdas/crudDynamoDbTableItem/index.mjs';
import {
  createTableItemRequest,
  deleteTableItemRequest,
  getTableItemRequest,
  updateTableItemRequest,
} from './crudDynamoDbTableItem/requests.mjs';

import { handler as plaidHandler } from '../../lambdas/crudPlaid/index.mjs';
import {
  mockExchangeTokenLinkRequest,
  getInstitutionByIdRequest,
  getUserAccountsRequest,
  mockSyncTransactionsForItemRequest,
  getTransactionsForAccountRequest,
  getUserItemsRequest,
  // getUserAccountsBalancesRequest,
} from './crudPlaid/requests.mjs';

dotenv.config();
const { TableName, Item } = dynamoDb;
const testApi = process.env.USE_API_GATEWAY === 'true';

const api = axios.create({
  baseURL: process.env.AWS_API_GATEWAY,
  headers: { Authorization: process.env.AUTH_TOKEN },
});

///////////////////
// TEST CONTROLS //
///////////////////
let buildTableAndItem = false;
let destroyTableAndItem = false;
let testPlaidItemActions = false;
// const STAGE = 'CREATE';
// const STAGE = 'PERSIST';
// const STAGE = 'DESTROY';
const STAGE = 'LIFECYCLE';

switch (STAGE) {
  case 'CREATE':
    buildTableAndItem = true;
    break;

  case 'PERSIST':
    testPlaidItemActions = true;
    break;

  case 'DESTROY':
    destroyTableAndItem = true;
    break;

  case 'LIFECYCLE':
    buildTableAndItem = true;
    testPlaidItemActions = true;
    destroyTableAndItem = true;
    break;

  default:
    throw new Error('missing test stage');
}

console.log(`TESTING: ${testApi ? 'AWS_API_GATEWAY' : 'LOCAL'}`);

const handleError = (err) => {
  let message = /*err.data || err.response?.data ||*/ err;
  console.error(message);
};

describe('lambda + dynamoDb integration tests', () => {
  if (buildTableAndItem) {
    describe('create tables', () => {
      it('should create user table', async () => {
        const request = createUserTableRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : tableHandler(request));

        if (status_code !== 200) console.error(body);
        await new Promise((resolve) => setTimeout(resolve, 8000));
        expect(status_code).toBe(200);
        expect(body.TableDescription.TableName).toBe(TableName.user);
      });

      it('should create transaction table', async () => {
        const request = createTransactionTableRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : tableHandler(request));
        if (status_code !== 200) console.error(body);
        await new Promise((resolve) => setTimeout(resolve, 8000));
        expect(status_code).toBe(200);
        expect(body.TableDescription.TableName).toBe(TableName.transaction);
      });
    });
  }

  describe('read tables', () => {
    it('should get user table', async () => {
      const request = getUserTableRequest;
      const { status_code, body } = await (testApi
        ? api({
            url: request.context['resource-path'],
            method: request.context['http-method'],
            data: request.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : tableHandler(request));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });

    it('should get transaction table', async () => {
      const request = getTransactionTableRequest;
      const { status_code, body } = await (testApi
        ? api({
            url: request.context['resource-path'],
            method: request.context['http-method'],
            data: request.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : tableHandler(request));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });
  });

  describe('create, edit, & delete items from table', () => {
    if (buildTableAndItem) {
      it('should create Item', async () => {
        const request = createTableItemRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : tableItemHandler(request));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }

    it('should get table item', async () => {
      const request = getTableItemRequest;
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
      expect(body.Item.plaid_item.M[mockData.tokenExchange.item_id].M.id.S).toBe(
        mockData.tokenExchange.item_id
      );
      expect(body.Item.plaid_item.M[mockData.tokenExchange.item_id].M.institution_name.S).toBe(
        mockData.institutionName
      );
    });

    it('should update table item with existing properties', async () => {
      const request = updateTableItemRequest;
      const { status_code, body } = await (testApi
        ? api({
            url: request.context['resource-path'],
            method: request.context['http-method'],
            data: request.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : tableItemHandler(request));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      // expect unchanged
      expect(body.Attributes.email.S).toBe(Item.original.email);
      // expect changed
      expect(body.Attributes.verified.BOOL).toBe(true);
    });

    if (testPlaidItemActions) {
      it('should add new plaid item with mocked token exchange', async () => {
        const request = mockExchangeTokenLinkRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : plaidHandler(request));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.public_token_exchange).toBe('complete');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('should simulate item sync & write transactions to db', async () => {
        const request = mockSyncTransactionsForItemRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : plaidHandler(request));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.tx_sync).toBe('complete');
        expect(body.tx_cursor_updated_at).not.toBe(undefined);
        expect(body.added).toBeGreaterThan(0);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('should get plaid items for one user', async () => {
        const request = getUserItemsRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : plaidHandler(request));

        if (status_code !== 200) console.error(body);

        const item = Object.values(body.items)[0];

        expect(status_code).toBe(200);
        expect(body.last_activity).not.toBe(undefined);
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
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : plaidHandler(request));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.accounts.length).toBeGreaterThan(0);
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
      //   const { status_code, body } = await (testApi
      //     ? api({
      //         url: request.context['resource-path'],
      //         method: request.context['http-method'],
      //         data: request.body,
      //       })
      //         .then(({ data }) => data)
      //         .catch(handleError)
      //     : plaidHandler(request));

      //   if (status_code !== 200) console.error(body);
      //   expect(status_code).toBe(200);
      //   expect(Array.isArray(body.account)).toBe(true);

      //   const account = Object.values(body.account)[0];
      //   expect(account.balances.available).toBeGreaterThan(0);
      // });

      it('should get plaid item account transactions', async () => {
        const request = getTransactionsForAccountRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              params: request.params.querystring,
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : plaidHandler(request));

        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
        expect(body.transactions?.length).toBe(48);

        const transaction = body.transactions[0];
        expect(transaction).toHaveProperty('created_at');
        expect(transaction).toHaveProperty('updated_at');
        expect(transaction).toHaveProperty('transaction_id');
        expect(transaction).toHaveProperty('item_id::account_id');
        expect(transaction).toHaveProperty('transaction');
        expect(typeof transaction.created_at === 'string').toBe(true);
        expect(typeof transaction.updated_at === 'string').toBe(true);
        expect(typeof transaction.transaction_id === 'string').toBe(true);
        expect(typeof transaction['item_id::account_id'] === 'string').toBe(
          true
        );
        expect(typeof transaction.transaction === 'object').toBe(true);
        expect(Object.keys(transaction.transaction).length).toBe(23);
      });

      it('should get bank institution details by id institution_id', async () => {
        const request = getInstitutionByIdRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              params: request.params.querystring,
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : plaidHandler(request));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.logo).not.toBe(null);
      });
    }

    if (destroyTableAndItem) {
      it('should DELETE item from Table', async () => {
        const request = deleteTableItemRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : tableItemHandler(request));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }
  });

  if (destroyTableAndItem) {
    describe('destroy tables', () => {
      it('should delete user table', async () => {
        const request = deleteUserTableRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : tableHandler(request));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
      it('should delete transaction table', async () => {
        const request = deleteTransactionTableRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: request.context['resource-path'],
              method: request.context['http-method'],
              data: request.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : tableHandler(request));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    });
  }
});
