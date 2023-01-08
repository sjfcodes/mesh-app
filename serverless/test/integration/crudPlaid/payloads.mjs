import lambdaConfig from '../../../lambdas/crudPlaid/utils/config.mjs';
import dynamoDbConfig from '../../config/dynamoDb.mjs';

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;

export const createTokenLinkPayload = {
  body: {
    TableName,
    path: path.linkTokenCreate,
  },
  context: { ['http-method']: 'PUT' },
  params,
};

export const exchangeTokenLinkPayload = {
  body: {
    path: path.linkTokenExchange,
    payload: {
      public_token: 'public-sandbox-26241a68-d5f6-4406-86b4-d049c57dcf27',
      institution_id: 'ins_115585',
    },
  },
  context: { ['http-method']: 'POST' },
  params,
};
