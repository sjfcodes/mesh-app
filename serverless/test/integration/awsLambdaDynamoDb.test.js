import * as dotenv from 'dotenv';
import axios from 'axios';

import dynamoDb from '../config/dynamoDb.mjs';
import {
  createTable,
  deleteTable,
  getTable,
} from './crudDynamoDbTable/modules.mjs';
import {
  getTablePayload,
  createTablePayload,
  deleteTablePayload,
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
  exchangeTokenLinkPayload,
  syncTransactionsForItemPayload,
} from './crudPlaid/payloads.mjs';
import {
  exchangeToken,
  syncTransactionsForItem,
} from './crudPlaid/modules.mjs';

dotenv.config();

const rebuildTableAndItem = false;
const destroyTableAndItem = false;

let plaidTestItemId = null;

const testApi = process.env.USE_API_GATEWAY === 'true';
console.log(`TESTING: ${testApi ? 'AWS_API_GATEWAY' : 'LOCAL'}`);

const { TableName, Item } = dynamoDb;

const apiTable = axios.create({
  baseURL: process.env.AWS_API_GATEWAY + '/dynamodbtable',
  headers: { Authorization: process.env.AUTH_TOKEN },
});

const apiTableItem = axios.create({
  baseURL: process.env.AWS_API_GATEWAY + '/dynamodbtableitem',
  headers: { Authorization: process.env.AUTH_TOKEN },
});

describe('lambda + dynamoDb integration tests', () => {
  if (rebuildTableAndItem) {
    describe('create table', () => {
      it('should create table', async () => {
        const { status_code, body } = await (testApi
          ? apiTable({
              method: createTablePayload.context['http-method'],
              data: createTablePayload,
            }).then(({ data }) => data)
          : createTable());
        if (status_code !== 200) console.error(body);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        expect(status_code).toBe(200);
        expect(body.TableDescription.TableName).toBe(TableName.user);
      });
    });
  }

  describe('read table', () => {
    it('should get table', async () => {
      const { status_code, body } = await (testApi
        ? apiTable({
            method: getTablePayload.context['http-method'],
            data: getTablePayload,
          }).then(({ data }) => data)
        : getTable());

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
    });
  });

  describe('create, edit, & delete items from table', () => {
    if (rebuildTableAndItem) {
      it('should create Item', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: createTableItemPayload.context['http-method'],
              data: createTableItemPayload,
            }).then(({ data }) => data)
          : createTableItem());
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }

    it('should get Item', async () => {
      const { status_code, body } = await (testApi
        ? apiTableItem({
            method: getTableItemPayload.context['http-method'],
            data: getTableItemPayload,
          }).then(({ data }) => data)
        : getTableItem());

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      expect(body.Item.email.S).toBe(Item.original.email.S);
    });

    it('should update item with existing properties', async () => {
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

    it('should add new plaid item', async () => {
      const { status_code, body } = await (testApi
        ? apiTableItem({
            method: exchangeTokenLinkPayload.context['http-method'],
            data: exchangeTokenLinkPayload,
          }).then(({ data }) => data)
        : exchangeToken());

      if (status_code !== 200) console.error(body);

      plaidTestItemId = body.item_id;

      expect(status_code).toBe(200);
      expect(body.public_token_exchange).toBe('complete');
    });

    it('should sync new transactions for item', async () => {
      const payload = syncTransactionsForItemPayload(plaidTestItemId);
      const { status_code, body } = await (testApi
        ? apiTableItem({
            method: payload.context['http-method'],
            data: payload,
          }).then(({ data }) => data)
        : syncTransactionsForItem(payload));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      expect(body.tx_sync).toBe('complete');
      expect(body.summary.added).toBeGreaterThan(0);
    });

    it('should sync new transactions for item', async () => {
      const payload = syncTransactionsForItemPayload(plaidTestItemId);
      const { status_code, body } = await (testApi
        ? apiTableItem({
            method: payload.context['http-method'],
            data: payload,
          }).then(({ data }) => data)
        : syncTransactionsForItem(payload));

      if (status_code !== 200) console.error(body);

      expect(status_code).toBe(200);
      expect(body.tx_sync).toBe('complete');
      expect(body.summary.added).toBe(0);
    });

    if (destroyTableAndItem ) {
      it('should DELETE item from Table', async () => {
        const { status_code, body } = await (testApi
          ? apiTableItem({
              method: deleteTableItemPayload.context['http-method'],
              data: deleteTableItemPayload,
            }).then(({ data }) => data)
          : deleteTableItem());
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    }
  });

  if (destroyTableAndItem ) {
    describe('destroy table', () => {
      it('should delete table', async () => {
        const { status_code, body } = await (testApi
          ? apiTable({
              method: deleteTablePayload.context['http-method'],
              data: deleteTablePayload,
            }).then(({ data }) => data)
          : deleteTable());
        if (status_code !== 200) console.error(body);
        expect(status_code).toBe(200);
      });
    });
  }
});
