import lambdaConfig from "../../../lambdas/crudPlaidLink/utils/config.mjs";
import dynamoDbConfig from "../../config/dynamoDb.mjs";

const { TableName, path } = lambdaConfig;
const { params } = dynamoDbConfig;

export const createTokenLinkPayload = {
  body: {
    TableName,
    path: path.linkTokenCreate,
  },
  context: { ["http-method"]: "PUT" },
  params,
};

export const exchangeTokenLinkPayload = {
  body: {
    path: path.linkTokenExchange,
    payload: [
      {
        public_token: "public-sandbox-e4fb4ef9-c55c-4a1d-83b5-901103193ab8",
        institution_id: "ins_115585",
        CONTINUE_HERE:
          "https://plaid.com/docs/api/tokens/#itempublic_tokenexchange",
      },
    ],
  },
  context: { ["http-method"]: "POST" },
  params,
};
