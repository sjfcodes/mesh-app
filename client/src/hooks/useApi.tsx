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

  const getLinkToken = async (userId: string, itemId: string | null) => {
    // axios(`/link-token`, {
    const response = await axios({
      method: 'POST',
      url: url + '/link/token-create',
      headers: { Authorization: await getAuthToken() },
      data: { path: '/link/token-create' },
    });
    return response;
  };

  // @lambda-crudPlaid
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
          path: '/item/token-exchange',
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

  // accounts
  const getAccountsByItem = async (itemId: string) =>
    axios({
      method: 'GET',
      url: url + `/item/account`,
      headers: { Authorization: await getAuthToken() },
    });
  const getAccountsByUser = async (userId: string) =>
    axios({
      method: 'GET',
      url: url + `/item/account`,
      headers: { Authorization: await getAuthToken() },
    });

  // assets
  const addAsset = (userId: number, description: string, value: number) =>
    axios({
      method: 'POST',
      url: url + '/assets',
      data: { userId, description, value },
    });
  const getAssetsByUser = (userId: number) =>
    axios({
      method: 'GET',
      url: url + `/assets/${userId}`,
    });
  const deleteAssetByAssetId = (assetId: number) =>
    axios({
      method: 'DELETE',
      url: url + `/assets/${assetId}`,
    });

  // transactions
  const getTransactionsByAccount = async (accountId: string) =>
    axios({
      method: 'GET',
      url: url + `/accounts/${accountId}/transactions`,
      headers: {
        Authorization: await getAuthToken(),
      },
    });
  const getTransactionsByItem = async (itemId: string) =>
    axios({
      method: 'GET',
      url: url + `/items/${itemId}/transactions`,
      headers: { Authorization: await getAuthToken() },
    });
  const getTransactionsByUser = async (userId: string) =>
    axios({
      method: 'GET',
      url: url + `/user/transaction`,
      headers: { Authorization: await getAuthToken() },
    });

  // institutions
  const getInstitutionById = async (instId: string) =>
    axios({
      method: 'GET',
      url: `/institutions/${instId}`,
      headers: { Authorization: await getAuthToken() },
    });

  const setItemState = async (itemId: string, status: string) =>
    axios({
      url: url + `items/${itemId}`,
      method: 'PUT',
      headers: { Authorization: await getAuthToken() },
      data: { status },
    });

  // This endpoint is only availble in the sandbox enviornment
  const setItemToBadState = async (itemId: string) =>
    axios({
      method: 'POST',
      url: url + '/items/sandbox/item/reset_login',
      headers: { Authorization: await getAuthToken() },
      data: { itemId },
    });

  const testLambda = async (method = 'GET') => {
    const { data } = await axios({
      method,
      url,
      headers: { Authorization: await getAuthToken() },
      data: { hello: 'world' },
    });

    return data;
  };

  return {
    exchangeToken,
    getTransactionsByAccount,
    getTransactionsByItem,
    getTransactionsByUser,
    getAccountsByItem,
    getAccountsByUser,
    addAsset,
    getAssetsByUser,
    deleteAssetByAssetId,
    getInstitutionById,
    getLinkToken,
    setItemState,
    setItemToBadState,
    testLambda,
  };
};

export default useApi;
