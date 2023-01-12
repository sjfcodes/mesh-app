import axios from 'axios';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import DuplicateItemToastMessage from '../components/DuplicateItemToast';

const { REACT_APP_AWS_API_GATEWAY, REACT_APP_AWS_API_GATEWAY_STAGE } =
  process.env;

const url = REACT_APP_AWS_API_GATEWAY + '/' + REACT_APP_AWS_API_GATEWAY_STAGE;

const useApi = () => {
  const getAuthToken = async () =>
    (await Auth.currentSession()).getIdToken().getJwtToken();

  ///////////////////////////////////
  // has aws api gateway endpoints //
  ///////////////////////////////////

  // setup token
  const getLinkToken = async () => {
    const response = await axios({
      method: 'POST',
      url: url + '/link/token-create',
      headers: { Authorization: await getAuthToken() },
      data: { path: '/link/token-create' },
    });
    return response;
  };
  const exchangeToken = async (
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
  const getAllItems = async () =>
    axios({
      method: 'GET',
      url: url + `/item`,
      headers: { Authorization: await getAuthToken() },
    });

  // item account
  const getAllItemAccounts = async () =>
    axios({
      method: 'GET',
      url: url + `/item/account`,
      headers: { Authorization: await getAuthToken() },
    });

  // institutions
  const getItemInstitution = async (instId: string) =>
    axios({
      method: 'GET',
      url: url + '/item/institution/',
      params: {
        institution_id: instId,
      },
      headers: { Authorization: await getAuthToken() },
    });

  // transactions
  const getItemAccountTransactions = async (
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

  return {
    exchangeToken,
    getAllItems,
    getAllItemAccounts,
    getItemAccountTransactions,
    getItemInstitution,
    getLinkToken,
  };
};

export default useApi;
