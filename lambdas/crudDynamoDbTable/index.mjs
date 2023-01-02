import { config } from './utils/config.mjs';

export const handler = async (event) => {
  //   console.log('Received event:', JSON.stringify(event, null, 2));

  const body = {
    config,
  };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(body),
  };
};
