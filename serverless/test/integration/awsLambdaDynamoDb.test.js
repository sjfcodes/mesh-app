import * as dotenv from 'dotenv';
import axios from 'axios';

import dynamoDb from '../config/dynamoDb.mjs';
import {
  createTransactionTable,
  createUserTable,
  deleteTransactionTable,
  deleteUserTable,
  getTransactionTable,
  getUserTable,
} from './crudDynamoDbTable/modules.mjs';
import {
  getUserTableRequest,
  createUserTableRequest,
  deleteUserTableRequest,
  deleteTransactionTableRequest,
  createTransactionTableRequest,
  getTransactionTableRequest,
} from './crudDynamoDbTable/requests.mjs';
import {
  createTableItemRequest,
  deleteTableItemRequest,
  getTableItemRequest,
  updateTableItemRequest,
} from './crudDynamoDbTableItem/requests.mjs';
import {
  createTableItem,
  deleteTableItem,
  getTableItem,
  updateTableItemItem,
} from './crudDynamoDbTableItem/modules.mjs';
import {
  mockExchangeTokenLinkRequest,
  getInstitutionByIdRequest,
  getUserAccountsRequest,
  mockSyncTransactionsForItemRequest,
  getTransactionsForAccountRequest,
  getUserItemsRequest,
  getUserAccountsBalancesRequest,
} from './crudPlaid/requests.mjs';
import { handler as crudPlaid } from '../../lambdas/crudPlaid/index.mjs';
import mockData from './crudPlaid/mockData/plaid.js';

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
const STAGE = 'PERSIST';
// const STAGE = 'DESTROY';
// const STAGE = 'LIFECYCLE';

switch (STAGE) {
  case 'LIFECYCLE':
    buildTableAndItem = true;
    testPlaidItemActions = true;
    destroyTableAndItem = true;
    break;

  case 'CREATE':
    buildTableAndItem = true;
    testPlaidItemActions = true;
    break;

  case 'PERSIST':
    testPlaidItemActions = true;
    break;

  case 'DESTROY':
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
        const { status_code, body } = await (testApi
          ? api({
              url: 'dynamodbtable',
              method: createUserTableRequest.context['http-method'],
              data: createUserTableRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : createUserTable(createUserTableRequest));

        if (status_code !== 200) console.error(body);
        await new Promise((resolve) => setTimeout(resolve, 8000));
        expect(status_code).toBe(200);
        expect(body.TableDescription.TableName).toBe(TableName.user);
      });

      it('should create transaction table', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtable',
              method: createTransactionTableRequest.context['http-method'],
              data: createTransactionTableRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : createTransactionTable(createTransactionTableRequest));
        if (status_code !== 200) console.error(body);
        await new Promise((resolve) => setTimeout(resolve, 8000));
        expect(status_code).toBe(200);
        expect(body.TableDescription.TableName).toBe(TableName.transaction);
      });
    });
  }

  describe('read tables', () => {
    it('should get user table', async () => {
      const { status_code, body } = await (testApi
        ? api({
            url: '/dynamodbtable',
            method: getUserTableRequest.context['http-method'],
            data: getUserTableRequest.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : getUserTable(getUserTableRequest));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });

    it('should get transaction table', async () => {
      const { status_code, body } = await (testApi
        ? api({
            url: '/dynamodbtable',
            method: getTransactionTableRequest.context['http-method'],
            data: getTransactionTableRequest.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : getTransactionTable(getTransactionTableRequest));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });
  });

  describe('create, edit, & delete items from table', () => {
    if (buildTableAndItem) {
      it('should create Item', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtableitem',
              method: createTableItemRequest.context['http-method'],
              data: createTableItemRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : createTableItem(createTableItemRequest));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }

    it('should get table item', async () => {
      const { status_code, body } = await (testApi
        ? api({
            url: '/dynamodbtableitem',
            method: getTableItemRequest.context['http-method'],
            data: getTableItemRequest.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : getTableItem(getTableItemRequest));

      expect(status_code).toBe(200);
      expect(body.Item.email.S).toBe(Item.original.email.S);
      expect(body.Item.email.S).toBe(Item.original.email.S);
    });

    it('should update table item with existing properties', async () => {
      const { status_code, body } = await (testApi
        ? api({
            url: '/dynamodbtableitem',
            method: updateTableItemRequest.context['http-method'],
            data: updateTableItemRequest.body,
          })
            .then(({ data }) => data)
            .catch(handleError)
        : updateTableItemItem(updateTableItemRequest));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      // expect unchanged
      expect(body.Attributes.email.S).toBe(Item.original.email.S);
      // expect changed
      expect(body.Attributes.verified.BOOL).toBe(true);
    });

    if (testPlaidItemActions) {
      it('should add new plaid item with mocked token exchange', async () => {
        const payload = mockExchangeTokenLinkRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: payload.context['resource-path'],
              method: payload.context['http-method'],
              data: payload.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : crudPlaid(payload));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.public_token_exchange).toBe('complete');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('should simulate item sync & write transactions to db', async () => {
        const payload = mockSyncTransactionsForItemRequest;
        const { status_code, body } = await (testApi
          ? api({
              url: payload.context['resource-path'],
              method: payload.context['http-method'],
              data: payload.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : crudPlaid(payload));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.tx_sync).toBe('complete');
        expect(body.tx_cursor_updated_at).not.toBe(undefined);
        expect(body.added).toBeGreaterThan(0);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('should get plaid items for one user', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtableitem',
              method: getUserItemsRequest.context['http-method'],
              data: getUserItemsRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : crudPlaid(getUserItemsRequest));

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
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtableitem',
              method: getUserAccountsRequest.context['http-method'],
              data: getUserAccountsRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : crudPlaid(getUserAccountsRequest));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.accounts.length).toBeGreaterThan(0);
      });

      // it('should get plaid item account balances for user', async () => {
      //   const { status_code, body } = await (testApi
      //     ? api({
      //           url: '/dynamodbtableitem',
      //         method: getUserAccountsBalancesRequest.context['http-method'],
      //         data: getUserAccountsBalancesRequest.body,
      //       })
      //         .then(({ data }) => data)
      //         .catch(handleError)
      //     : crudPlaid(getUserAccountsBalancesRequest));

      //   if (status_code !== 200) console.error(body);
      //   expect(status_code).toBe(200);
      //   expect(Array.isArray(body.account)).toBe(true);

      //   const account = Object.values(body.account)[0];
      //   expect(account.balances.available).toBeGreaterThan(0);
      // });

      it('should get plaid item account transactions', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtableitem',
              method: getTransactionsForAccountRequest.context['http-method'],
              data: getTransactionsForAccountRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : crudPlaid(getTransactionsForAccountRequest));

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
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtableitem',
              method: getInstitutionByIdRequest.context['http-method'],
              data: getInstitutionByIdRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : crudPlaid(getInstitutionByIdRequest));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.logo).not.toBe(null);
      });
    }

    if (destroyTableAndItem) {
      it('should DELETE item from Table', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtableitem',
              method: deleteTableItemRequest.context['http-method'],
              data: deleteTableItemRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : deleteTableItem(deleteTableItemRequest));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }
  });

  if (destroyTableAndItem) {
    describe('destroy tables', () => {
      it('should delete user table', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtable',
              method: deleteUserTableRequest.context['http-method'],
              data: deleteUserTableRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : deleteUserTable(deleteUserTableRequest));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
      it('should delete transaction table', async () => {
        const { status_code, body } = await (testApi
          ? api({
              url: '/dynamodbtable',
              method: deleteTransactionTableRequest.context['http-method'],
              data: deleteTransactionTableRequest.body,
            })
              .then(({ data }) => data)
              .catch(handleError)
          : deleteTransactionTable(deleteTransactionTableRequest));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    });
  }
});
