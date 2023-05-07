import * as dotenv from 'dotenv';
import { handler as plaidHandler } from './lambdas/plaid/src/index.js';
import config from './lambdas/plaid/src/utils/config.js';
import { mockApiGwRequestTransformations } from './test/utils/helpers.js';
dotenv.config();


const getItems = async () => {
  const request = {
    httpMethod: 'GET',
    path: config.path.item,
    headers: { Authorization: process.env.AUTH_TOKEN },
  };
  return await plaidHandler(mockApiGwRequestTransformations(request))
}

const getBalancesByAccountId = async () => {
  const request = {
    httpMethod: 'GET',
    path: config.path.itemAccountBalance,
    headers: { Authorization: process.env.AUTH_TOKEN },
    queryStringParameters: {
      item_id: 'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k',
    },
  };
  return await plaidHandler(mockApiGwRequestTransformations(request))
}

(async () => {
  const response = await getItems();
  console.log('sbx response:', response);
  console.log(JSON.parse(response.body).data);
})();
