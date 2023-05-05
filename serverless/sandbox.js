import * as dotenv from 'dotenv';
import { handler as plaidHandler } from './lambdas/plaid/index.js';
import config from './lambdas/plaid/utils/config.js';
import { mockApiGwRequestTransformations } from './test/utils/helpers.js';
dotenv.config();

const request = {
  httpMethod: 'GET',
  path: config.path.itemAccountBalance,
  headers: { Authorization: process.env.AUTH_TOKEN },
  queryStringParameters: {
    item_id: 'MzmAABEMQMHwDay9d616FqOXPYvaoXsMp1D1k',
  },
};

(async () => {
  const response = await plaidHandler(mockApiGwRequestTransformations(request));
  console.log('sbx response:', response);
  console.log(JSON.parse(response.body));
})();
