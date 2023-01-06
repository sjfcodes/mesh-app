import axios from 'axios';
import { Auth } from 'aws-amplify';

const { REACT_APP_AWS_API_GATEWAY, REACT_APP_AWS_API_GATEWAY_STAGE } =
  process.env;

const url = REACT_APP_AWS_API_GATEWAY + '/' + REACT_APP_AWS_API_GATEWAY_STAGE;

const useApi = () => {
  const getAuthToken = async () =>
    (await Auth.currentSession()).getIdToken().getJwtToken();
  const getLinkToken = async (userId: number, itemId: number | null) => {
    // axios(`/link-token`, {
    const response = await axios({
      method: 'POST',
      url: url + '/plaid',
      headers: {
        Authorization: await getAuthToken(),
      },
      data: { path: '/link-token' },
    });
    return response;
  };

  const testLambda = async (method = 'GET') => {
    const { data } = await axios({
      method,
      url,
      headers: {
        Authorization: await getAuthToken(),
      },
      data: { hello: 'world' },
    });

    return data;
  };

  return { getLinkToken, testLambda };
};

export default useApi;
