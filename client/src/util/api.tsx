import axios from 'axios';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { PlaidInstitution, PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import DuplicateItemToastMessage from '../components/DuplicateItemToast';

const USE_STAGE = {
  DEV: process.env.REACT_APP_AWS_API_GW_DEV,
  PROD: process.env.REACT_APP_AWS_API_GW_PROD,
};

type stage = 'DEV' | 'PROD';
const TARGET_STAGE: stage =
  (process.env.REACT_APP_USE_API_GW as stage) || ('DEV' as stage);
const url = USE_STAGE[TARGET_STAGE];
if (!url) throw new Error('missing backend url!◊');

const api = async (request: any) =>
  axios({
    ...request,
    url: url + request.url,
    headers: {
      Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
  });

// create or update token
export const linkTokenCreate = async (item_id: string | null) =>
  api({
    method: item_id ? 'PUT' : 'POST',
    url: item_id ? '/item/update_login' : '/link/token_create',
    data: { item_id },
  });

// crate item
export const exchangeTokenCreateItem = async (
  public_token: string,
  institution: PlaidInstitution | null,
  accounts: PlaidLinkOnSuccessMetadata['accounts'],
  user_id: string
) => {
  try {
    return await api({
      url: '/item/token_exchange',
      method: 'POST',
      data: {
        accounts,
        institution_id: institution?.institution_id,
        institution_name: institution?.name,
        public_token,
        user_id,
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

export const getItems = async () => api({ method: 'GET', url: `/item` });

export const syncTransactionsByItemId = async (item_id: string) =>
  api({ method: 'PUT', url: `/item/sync`, data: { item_id } });

export const getBalancesByAccountId = async (
  item_id: string,
  account_id: string
) =>
  api({
    method: 'GET',
    url: `/item/account/balance`,
    params: { item_id, account_id },
  });

export const getTransactionsByAccountId = async (
  item_id: string,
  account_id: string
) =>
  api({
    method: 'GET',
    url: `/item/account/transaction`,
    params: { item_id, account_id },
  });

// institutions
export const getInstitutionById = async (institution_id: string) =>
  api({
    method: 'GET',
    url: '/item/institution',
    params: { institution_id },
  });
