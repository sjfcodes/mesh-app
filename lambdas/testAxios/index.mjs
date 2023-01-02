import axios from "axios";

export const handler = async (event) => {

  const { data } = await axios({
    method: "get",
    url: "https://op1mp1pn9h.execute-api.us-east-1.amazonaws.com/beta/pets/1",
  });

  const body = {
    ...event.body,
    data,
  };

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(body),
  };
};
