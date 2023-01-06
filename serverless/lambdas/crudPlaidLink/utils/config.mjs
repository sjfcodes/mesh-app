import * as dotenv from "dotenv";
dotenv.config();

const awsRegion = "us-east-1";

export const config = {
  awsRegion,
  appName: "Mesh App",
  jwks: `https://cognito-idp.${awsRegion}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  TableName: process.env.USER_TABLE_NAME,
  email: process.env.USER_EMAIL,
  path: {
    createLinkToken: "/link/token/create",
  },
};
