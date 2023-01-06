import * as dotenv from "dotenv";
import { handler } from "../index.mjs";
import { config } from "../utils/config.mjs";



export const createTokenLinkPayload = {
  body: {
    TableName: config.TableName,
    email: config.email,
  },
  headers: {
    Authentication: process.env.AUTH_TOKEN
  },
  httpMethod: "POST",
  path: config.path.createLinkToken,
};
