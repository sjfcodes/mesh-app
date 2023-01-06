import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import axios from 'axios';

const { REACT_APP_AWS_API_GATEWAY, REACT_APP_AWS_API_GATEWAY_STAGE } =
  process.env;

const baseURL =
  REACT_APP_AWS_API_GATEWAY + '/' + REACT_APP_AWS_API_GATEWAY_STAGE;

if (baseURL.includes('undefined'))
  throw new Error(`missing variable detected: ${baseURL}`);

const useLambda = () => {
  const [state, setState] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await axios({
        method: 'POST',
        baseURL,
        headers: {
          Authorization: (await Auth.currentSession())
            .getIdToken()
            .getJwtToken(),
        },
        data: { hello: 'world' },
      });

      setState(data);
    })();
  }, []);

  return [state, setState];
};

export default useLambda;
