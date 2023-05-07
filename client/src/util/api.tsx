import axios from 'axios';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { PlaidInstitution, PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
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

export const getAuthToken = async () => {
  const session = await Auth.currentSession();

  return session.getIdToken().getJwtToken();
};

const api = async (request: any) =>
  axios({
    ...request,
    headers: { Authorization: await getAuthToken() },
    url: url + request.url,
  });

// setup token
export const handleLinkTokenCreateUpdate = async (itemId: string | null) => {
  const method = itemId ? 'PUT' : 'POST';
  const route = itemId ? '/item/update_login' : '/link/token_create';

  return await api({
    method,
    url: route,
    data: { item_id: itemId },
  });
};

export const exchangeToken = async (
  publicToken: string,
  institution: PlaidInstitution | null,
  accounts: PlaidLinkOnSuccessMetadata['accounts'],
  userId: string
) => {
  try {
    return await api({
      url: '/item/token_exchange',
      method: 'POST',
      data: {
        accounts,
        institution_id: institution?.institution_id,
        institution_name: institution?.name,
        public_token: publicToken,
        user_id: userId,
      },
    });
  } catch (err: any) {
    if (err?.response && err.response.status === 409) {
      toast.error(
        <DuplicateItemToastMessage institutionName={institution?.name} />
      );
    } else {
      toast.error(`Error linking ${institution?.name}`);
    }
  }
};

// item
export const getAllItems = async () =>
  api({
    method: 'GET',
    url: `/item`,
  });
export const syncItemTransactions = async (itemId: string) =>
  api({
    method: 'PUT',
    url: `/item/sync`,
    data: {
      item_id: itemId,
    },
  });

// item account
export const getAllItemAccounts = async () =>
  api({
    method: 'GET',
    url: `/item/account`,
  });

export const getInstitutionAccountBalances = async (
  itemId: string,
  accountId: string
) =>
  api({
    method: 'GET',
    url: `/item/account/balance`,
    params: {
      item_id: itemId,
      account_id: accountId,
    },
  });

// institutions
export const getInstitutionsById = async (instId: string) =>
  api({
    method: 'GET',
    url: '/item/institution',
    params: {
      institution_id: instId,
    },
  });

// transactions
export const getAccountTransactions = async (
  itemId: string,
  accountId: string
) =>
  api({
    method: 'GET',
    url: `/item/account/transaction`,
    params: {
      item_id: itemId,
      account_id: accountId,
    },
  });
