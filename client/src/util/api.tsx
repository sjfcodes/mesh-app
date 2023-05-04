import axios from 'axios';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import DuplicateItemToastMessage from '../components/DuplicateItemToast';
const {
  REACT_APP_AWS_API_GW_DEV,
  REACT_APP_AWS_API_GW_PROD,
  REACT_APP_USE_API_GW,
} = process.env;

const USE_STAGE = {
  DEV: REACT_APP_AWS_API_GW_DEV,
  PROD: REACT_APP_AWS_API_GW_PROD,
};

type stage = 'DEV' | 'PROD';
const TARGET_STAGE: stage = (REACT_APP_USE_API_GW as stage) || ('DEV' as stage);

const url = USE_STAGE[TARGET_STAGE];

if (!url) {
  throw new Error('missing backend url!◊');
}

export const getAuthToken = async () =>
  (await Auth.currentSession()).getIdToken().getJwtToken();

// setup token
export const handleLinkTokenCreateUpdate = async (itemId: string | null) => {
  const method = itemId ? 'PUT' : 'POST';
  const route = itemId ? '/item/update_login' : '/link/token_create';

  return await axios({
    method,
    url: url + route,
    headers: { Authorization: await getAuthToken() },
    data: { path: route, payload: { item_id: itemId } },
  });
};

type Institution = {
  institution_id: string;
  name: string;
};
export const exchangeToken = async (
  publicToken: string,
  institution: Institution,
  accounts: PlaidLinkOnSuccessMetadata['accounts'],
  userId: string
) => {
  try {
    return await axios({
      url: url + '/item/token_exchange',
      method: 'POST',
      headers: { Authorization: await getAuthToken() },
      data: {
        payload: {
          accounts,
          institution_id: institution.institution_id,
          institution_name: institution.name,
          public_token: publicToken,
          user_id: userId,
        },
      },
    });
  } catch (err: any) {
    if (err?.response && err.response.status === 409) {
      toast.error(
        <DuplicateItemToastMessage institutionName={institution.name} />
      );
    } else {
      toast.error(`Error linking ${institution.name}`);
    }
  }
};

// item
export const getAllItems = async () =>
  axios({
    method: 'GET',
    url: url + `/item`,
    headers: { Authorization: await getAuthToken() },
  });
export const syncItemTransactions = async (itemId: string) =>
  axios({
    method: 'PUT',
    url: url + `/item/sync`,
    headers: { Authorization: await getAuthToken() },
    data: {
      payload: {
        item_id: itemId,
      },
    },
  });

// item account
export const getAllItemAccounts = async () =>
  axios({
    method: 'GET',
    url: url + `/item/account`,
    headers: { Authorization: await getAuthToken() },
  });

export const getItemAccountBalances = async (itemId: string) =>
  axios({
    method: 'GET',
    url: url + `/item/account/balance`,
    headers: {
      Authorization: await getAuthToken(),
    },
    params: {
      item_id: itemId,
    },
  });

// institutions
export const getItemInstitution = async (instId: string) =>
  axios({
    method: 'GET',
    url: url + '/item/institution',
    params: {
      institution_id: instId,
    },
    headers: { Authorization: await getAuthToken() },
  });

// transactions
export const getItemAccountTransactions = async (
  itemId: string,
  accountId: string
) =>
  axios({
    method: 'GET',
    url: url + `/item/account/transaction`,
    headers: {
      Authorization: await getAuthToken(),
    },
    params: {
      item_id: itemId,
      account_id: accountId,
    },
  });
