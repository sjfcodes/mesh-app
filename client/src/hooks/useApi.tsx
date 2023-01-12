import axios from 'axios';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import DuplicateItemToastMessage from '../components/DuplicateItemToast';
// import userTransactionsJson from '../mockData/transactions.json';

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
    // axios(`/link-token`, {
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

  ////////////////
  // not in use //
  ////////////////
  // plaid item accounts
  // const getAccountsByItem = async (itemId: string) =>
  //   axios({
  //     method: 'GET',
  //     url: url + `/item/account`,
  //     headers: { Authorization: await getAuthToken() },
  //   });

  // assets
  // const addAsset = async (userId: number, description: string, value: number) =>
  //   axios({
  //     method: 'POST',
  //     url: url + '/assets',
  //     headers: { Authorization: await getAuthToken() },
  //     data: { userId, description, value },
  //   });
  // const getAssetsByUser = async (userId: number) => {
  //   console.log('mock with data GET: /asset');
  //   return {
  //     data: [{}, {}, {}].map((x, idx) => ({
  //       id: 'mock-asset-id-' + idx,
  //       user_id: 'mock-asset-user_id-' + idx,
  //       value: Math.floor(Math.random() * 10),
  //       description: 'mock-asset-description-' + idx,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //     })),
  //   };
  //   //  return  axios({
  //   //     method: 'GET',
  //   //     url: url + `/assets`,
  //   //     headers: { Authorization: await getAuthToken() },
  //   //   });
  // };
  // const deleteAssetByAssetId = async (assetId: number) =>
  //   axios({
  //     method: 'DELETE',
  //     url: url + `/assets/${assetId}`,
  //     headers: { Authorization: await getAuthToken() },
  //   });

  // const getTransactionsByUser = async (userId: string) => {
  //   console.log('mock with data; GET: /user/transaction');
  //   return {
  //     data: userTransactionsJson.map((tx, idx) => {
  //       return {
  //         id: 'mock-id-' + idx,
  //         item_id: 'mock-item_id-' + idx,
  //         user_id: userId,
  //         plaid_transaction_id: tx.transaction_id,
  //         plaid_category_id: tx.category_id,
  //         subcategory: 'mock-subcategory-' + idx,
  //         type: 'mock-type-' + idx,
  //         ...tx,
  //       };
  //     }),
  //   };
  // };
  // const getTransactionsByItem = async (itemId: string) =>
  //   axios({
  //     method: 'GET',
  //     url: url + `/items/${itemId}/transactions`,
  //     headers: { Authorization: await getAuthToken() },
  //   });

  //  return  axios({
  //     method: 'GET',
  //     url: url + `/user/transaction`,
  //     headers: { Authorization: await getAuthToken() },
  //   });

  // items
  // const getItemById = async (id: string) =>
  //   axios({
  //     method: 'GET',
  //     url: url + `/items/${id}`,
  //     headers: { Authorization: await getAuthToken() },
  //   });

  // const deleteItemById = async (id: string) =>
  //   axios({
  //     method: 'DELETE',
  //     url: url + `/items/${id}`,
  //     headers: { Authorization: await getAuthToken() },
  //   });

  // const setItemState = async (itemId: string, status: string) =>
  //   axios({
  //     url: url + `items/${itemId}`,
  //     method: 'PUT',
  //     headers: { Authorization: await getAuthToken() },
  //     data: { status },
  //   });
  // This endpoint is only available in the sandbox environment
  // const setItemToBadState = async (itemId: string) =>
  //   axios({
  //     method: 'POST',
  //     url: url + '/items/sandbox/item/reset_login',
  //     headers: { Authorization: await getAuthToken() },
  //     data: { itemId },
  //   });

  return {
    exchangeToken,
    getAllItems,
    getAllItemAccounts,
    getItemAccountTransactions,
    getItemInstitution,
    getLinkToken,
    // getTransactionsByItem,
    // getTransactionsByUser,
    // getAccountsByItem,
    // addAsset,
    // getAssetsByUser,
    // deleteAssetByAssetId,
    // getItemById,
    // deleteItemById,
    // setItemState,
    // setItemToBadState,
  };
};

export default useApi;
