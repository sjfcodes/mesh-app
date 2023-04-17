import axios from 'axios';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import DuplicateItemToastMessage from '../components/DuplicateItemToast';

const { REACT_APP_AWS_API_GATEWAY, REACT_APP_AWS_API_GATEWAY_STAGE } =
  process.env;

const url = REACT_APP_AWS_API_GATEWAY + '/' + REACT_APP_AWS_API_GATEWAY_STAGE;

const getAuthToken = async () =>
  (await Auth.currentSession()).getIdToken().getJwtToken();

// setup token
export const handleLinkTokenCreateUpdate = async (itemId: string | null) => {
  const method = itemId ? 'PUT' : 'POST';
  const route = itemId ? '/item/update_login' : '/link/token-create';

  const response = await axios({
    method,
    url: url + route,
    headers: { Authorization: await getAuthToken() },
    data: { path: route, payload: { item_id: itemId } },
  });
  return response;
};

export const exchangeToken = async (
  publicToken: string,
  institution: any,
  accounts: PlaidLinkOnSuccessMetadata['accounts'],
  userId: string
) => {
  try {
    const { data } = await axios({
      url: url + '/item/token-exchange',
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

    return data;
  } catch (err) {
    // @ts-ignore TODO: resolve this ignore
    if (err.response && err.response.status === 409) {
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

export const getItemAccountBalances = async (
  itemId: string,
  accountId: string
) =>
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
    url: url + '/item/institution/',
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
