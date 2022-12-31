import { config } from "./utils/config.mjs";

export const handler = async (event = {}) => {
  // TODO implement
  event.lambdas = { config, from: "handler" }

  const body = {
    config,
    from: "handler",
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
