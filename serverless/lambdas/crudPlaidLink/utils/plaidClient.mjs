import * as dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// https://plaid.com/docs/api/tokens/#linktokencreate

dotenv.config();

const {
  PLAID_CLIENT_ID,
  PLAID_ENV,
  PLAID_SECRET_DEVELOPMENT,
  PLAID_SECRET_SANDBOX,
  //   PLAID_SANDBOX_REDIRECT_URI,
  //   PLAID_DEVELOPMENT_REDIRECT_URI,
} = process.env;

// const redirect_uri =
//   PLAID_ENV == 'sandbox'
//     ? PLAID_SANDBOX_REDIRECT_URI
//     : PLAID_DEVELOPMENT_REDIRECT_URI;

// The Plaid secret is unique per environment. Note that there is also a separate production key,
// though we do not account for that here.
const PLAID_SECRET =
  PLAID_ENV === 'development' ? PLAID_SECRET_DEVELOPMENT : PLAID_SECRET_SANDBOX;

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default plaidClient;
