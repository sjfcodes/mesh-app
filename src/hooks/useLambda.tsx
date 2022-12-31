import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import axios from "axios";

const useLambda = () => {
  const [state, setState] = useState({});

  useEffect(() => {
    (async () => {
      const {
        data,
      } = await axios({
        method: "POST",
        baseURL: process.env.REACT_APP_AWS_API_GATEWAY,
        headers: {
          Authorization: (await Auth.currentSession())
            .getIdToken()
            .getJwtToken(),
        },
        data: { hello: "world" },
      });

      setState(data);
    })();
  }, []);

  return [state, setState];
};

export default useLambda;
