import * as dotenv from "dotenv";
import { handler } from "../index.mjs";
import { config } from "../utils/config.mjs";

export const createTokenLinkPayload = {
  body: {
    TableName: config.TableName,
    email: config.email,
    path: config.path.createLinkToken,
  },
  context: { ["http-method"]: "POST" },
  params: {
    header: {
      Authorization: process.env.AUTH_TOKEN,
    },
  },
  httpMethod: "POST",
};
