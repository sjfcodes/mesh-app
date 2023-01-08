import { handler } from "../../../lambdas/crudPlaid/index.mjs";
import { createTokenLinkPayload, exchangeTokenLinkPayload } from "./payloads.mjs";

export const createTokenLink = async () => handler(createTokenLinkPayload);

export const exchangeToken = async () => handler(exchangeTokenLinkPayload);
