import * as dotenv from 'dotenv';
import { handler as plaidHandler } from './lambdas/plaid/src/index.js';
import config from './lambdas/plaid/src/utils/config.js';
import { mockApiGwRequestTransformations } from './test/utils/helpers.js';
dotenv.config();

const item_id = 'gBxAPlp7kJfabErrWnNQfpvg9rBDebigMPmpD';
const account_id = 'gBxAPlp7kJfabErrWnNQfpvDJzaeQEFMK5mrd';

const getItems = async () => {
  const request = {
    httpMethod: 'GET',
    path: config.path.item,
    headers: { Authorization: process.env.AUTH_TOKEN },
  };
  return await plaidHandler(mockApiGwRequestTransformations(request));
};

const getBalancesByAccountId = async () => {
  const request = {
    httpMethod: 'GET',
    path: config.path.itemAccountBalance,
    headers: { Authorization: process.env.AUTH_TOKEN },
    queryStringParameters: {
      item_id,
    },
  };
  return await plaidHandler(mockApiGwRequestTransformations(request));
};

const getAccountTransactions = async () => {
  const request = {
    httpMethod: 'GET',
    path: config.path.itemAccountTransaction,
    headers: { Authorization: process.env.AUTH_TOKEN },
    queryStringParameters: {
      item_id,
      account_id,
    },
  };
  return await plaidHandler(mockApiGwRequestTransformations(request));
};
const syncTransactionsByItemId = async () => {
  const request = {
    httpMethod: 'PUT',
    path: config.path.itemSync,
    headers: { Authorization: process.env.AUTH_TOKEN },
    body: {
      item_id,
    },
  };
  return await plaidHandler(mockApiGwRequestTransformations(request));
};

(async () => {
  // const response = await syncTransactionsByItemId();
  // console.log('sbx response:', response);
  // console.log(JSON.parse(response.body).data);
})();
