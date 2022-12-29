const config = {
  aws_cognito_region: "us-east-1", // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: process.env.REACT_APP_USER_POOLS_ID, // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: process.env.REACT_APP_USER_POOLS_WEB_CLIENT_ID, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  aws_mandatory_sign_in: "enable", // (optional) - Users are not allowed to get the aws credentials unless they are signed in
  ...(process.env.NODE_ENV !== "development"
    ? {
        cookieStorage: {
          domain: process.env.REACT_APP_AUTH_COOKIE_DOMAIN,
          path: "/",
          expires: new Date(Date.now() + 10000),
          secure: true,
        },
      }
    : {}),
};

export default config;
