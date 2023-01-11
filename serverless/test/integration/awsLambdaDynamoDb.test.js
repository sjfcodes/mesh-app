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
  getUserTablePayload,
  createUserTablePayload,
  deleteUserTablePayload,
  deleteTransactionTablePayload,
  createTransactionTablePayload,
  getTransactionTablePayload,
} from './crudDynamoDbTable/payloads.mjs';
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemPayload,
} from './crudDynamoDbTableItem/payloads.mjs';
import {
  createTableItem,
  deleteTableItem,
  getTableItem,
  updateTableItemItem,
} from './crudDynamoDbTableItem/modules.mjs';
import {
  mockExchangeTokenLinkPayload,
  getInstitutionByIdPayload,
  getUserAccountsPayload,
  mockSyncTransactionsForItemPayload,
  getTransactionsForAccountPayload,
  getUserItemsPayload,
} from './crudPlaid/payloads.mjs';
import { handler as crudPlaid } from '../../lambdas/crudPlaid/index.mjs';
import mockData from './crudPlaid/mockData/plaid.js';

dotenv.config();
const { TableName, Item } = dynamoDb;
const testApi = process.env.USE_API_GATEWAY === 'true';
let buildTableAndItem = false;
let destroyTableAndItem = false;
let testPlaidItemActions = false;
let plaidTestAccounts = null;

const apiTable = axios.create({
  baseURL: process.env.AWS_API_GATEWAY + '/dynamodbtable',
  headers: { Authorization: process.env.AUTH_TOKEN },
});

const apiTableItem = axios.create({
  baseURL: process.env.AWS_API_GATEWAY + '/dynamodbtableitem',
  headers: { Authorization: process.env.AUTH_TOKEN },
});

///////////////////
// TEST CONTROLS //
///////////////////
// const STAGE = 'LIFECYCLE';
// const STAGE = 'CREATE';
const STAGE = 'PERSIST';
// const STAGE = 'DESTROY';

if (STAGE === 'LIFECYCLE') {
  buildTableAndItem = true;
  testPlaidItemActions = true;
  destroyTableAndItem = true;
}
if (STAGE === 'CREATE') {
  buildTableAndItem = true;
  testPlaidItemActions = true;
}
if (STAGE === 'PERSIST') {
  testPlaidItemActions = true;
}
if (STAGE === 'DESTROY') {
  destroyTableAndItem = true;
}

console.log(`TESTING: ${testApi ? 'AWS_API_GATEWAY' : 'LOCAL'}`);

describe('lambda + dynamoDb integration tests', () => {
  if (buildTableAndItem) {
    describe('create tables', () => {
      it('should create user table', async () => {
        const { status_code, body } = await (testApi
          ? apiTable({
              method: createUserTablePayload.context['http-method'],
              data: createUserTablePayload,
            }).then(({ data }) => data)
          : createUserTable(createUserTablePayload));
        if (status_code !== 200) console.error(body);
        await new Promise((resolve) => setTimeout(resolve, 8000));
        expect(status_code).toBe(200);
        expect(body.TableDescription.TableName).toBe(TableName.user);
      });

      it('should create transaction table', async () => {
        const { status_code, body } = await (testApi
          ? apiTable({
              method: createTransactionTablePayload.context['http-method'],
              data: createTransactionTablePayload,
            }).then(({ data }) => data)
          : createTransactionTable(createTransactionTablePayload));
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
        ? apiTable({
            method: getUserTablePayload.context['http-method'],
            data: getUserTablePayload,
          }).then(({ data }) => data)
        : getUserTable(getUserTablePayload));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });

    it('should get transaction table', async () => {
      const { status_code, body } = await (testApi
        ? apiTable({
            method: getTransactionTablePayload.context['http-method'],
            data: getTransactionTablePayload,
          }).then(({ data }) => data)
        : getTransactionTable(getTransactionTablePayload));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });
  });

  describe('create, edit, & delete items from table', () => {
    if (buildTableAndItem) {
      it('should create Item', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: createTableItemPayload.context['http-method'],
              data: createTableItemPayload,
            }).then(({ data }) => data)
          : createTableItem(createTableItemPayload));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }

    it('should get table item', async () => {
      const { status_code, body } = await (testApi
        ? apiTableItem({
            method: getTableItemPayload.context['http-method'],
            data: getTableItemPayload,
          }).then(({ data }) => data)
        : getTableItem(getTableItemPayload));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      expect(body.Item.email.S).toBe(Item.original.email.S);
    });

    it('should update table item with existing properties', async () => {
      const { status_code, body } = await (testApi
        ? apiTableItem({
            method: updateTableItemPayload.context['http-method'],
            data: updateTableItemPayload,
          }).then(({ data }) => data)
        : updateTableItemItem(updateTableItemPayload));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      // expect unchanged
      expect(body.Attributes.email.S).toBe(Item.original.email.S);
      // expect changed
      expect(body.Attributes.verified.BOOL).toBe(true);
    });

    if (testPlaidItemActions) {
      it('should add new plaid item with mocked token exchange', async () => {
        const payload = mockExchangeTokenLinkPayload;
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: payload.context['http-method'],
              data: payload,
            }).then(({ data }) => data)
          : crudPlaid(payload));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.public_token_exchange).toBe('complete');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('should write transactions to db, simulating sync', async () => {
        const payload = mockSyncTransactionsForItemPayload;
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: payload.context['http-method'],
              data: payload,
            }).then(({ data }) => data)
          : crudPlaid(payload));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.tx_sync).toBe('complete');
        expect(body.summary.added).toBeGreaterThan(0);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      });

      it('should get plaid items for one user', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: getUserItemsPayload.context['http-method'],
              data: getUserItemsPayload,
            }).then(({ data }) => data)
          : crudPlaid(getUserItemsPayload));

        if (status_code !== 200) console.error(body);
        
        const item = Object.values(body.items)[0]

        expect(status_code).toBe(200);
        expect(item).not.toHaveProperty('access_token');
        expect(item.id.S).toBe(mockData.tokenExchange.item_id);
        expect(Array.isArray(item.accounts.L)).toBe(true);
      });

      it('should get plaid item accounts for user', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: getUserAccountsPayload.context['http-method'],
              data: getUserAccountsPayload,
            }).then(({ data }) => data)
          : crudPlaid(getUserAccountsPayload));

        if (status_code !== 200) console.error(body);

        plaidTestAccounts = body.accounts;

        expect(status_code).toBe(200);
        expect(body.accounts.length).toBeGreaterThan(0);
      });

      it('should get plaid item account transactions', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: getTransactionsForAccountPayload.context['http-method'],
              data: getTransactionsForAccountPayload,
            }).then(({ data }) => data)
          : crudPlaid(getTransactionsForAccountPayload));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.transactions?.length).toBe(48);
      });

      it('should get bank institution details by id institution_id', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: getInstitutionByIdPayload.context['http-method'],
              data: getInstitutionByIdPayload,
            }).then(({ data }) => data)
          : crudPlaid(getInstitutionByIdPayload));

        if (status_code !== 200) console.error(body);

        expect(status_code).toBe(200);
        expect(body.logo).not.toBe(null);
      });
    }

    if (destroyTableAndItem) {
      it('should DELETE item from Table', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: deleteTableItemPayload.context['http-method'],
              data: deleteTableItemPayload,
            }).then(({ data }) => data)
          : deleteTableItem(deleteTableItemPayload));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }
  });

  if (destroyTableAndItem) {
    describe('destroy tables', () => {
      it('should delete user table', async () => {
        const { status_code, body } = await (testApi
          ? apiTable({
              method: deleteUserTablePayload.context['http-method'],
              data: deleteUserTablePayload,
            }).then(({ data }) => data)
          : deleteUserTable(deleteUserTablePayload));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
      it('should delete transaction table', async () => {
        const { status_code, body } = await (testApi
          ? apiTable({
              method: deleteTransactionTablePayload.context['http-method'],
              data: deleteTransactionTablePayload,
            }).then(({ data }) => data)
          : deleteTransactionTable(deleteTransactionTablePayload));
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    });
  }
});
