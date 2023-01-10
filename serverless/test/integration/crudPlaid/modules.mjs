import { handler } from '../../../lambdas/crudPlaid/index.mjs';
import config from '../../../lambdas/crudPlaid/utils/config.mjs';
import {
  createTokenLinkPayload,
  exchangeTokenLinkPayload,
  getUserAccountsPayload,
} from './payloads.mjs';

export const createTokenLink = async () => handler(createTokenLinkPayload);

export const exchangeToken = async () => handler(exchangeTokenLinkPayload);

export const syncTransactionsForItem = async (payload) => handler(payload);

export const getUserAccounts = async () =>
  handler(getUserAccountsPayload);
