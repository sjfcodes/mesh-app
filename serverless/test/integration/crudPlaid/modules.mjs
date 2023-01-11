import { handler } from '../../../lambdas/crudPlaid/index.mjs';

export const createTokenLink = async (payload) => handler(payload);
export const exchangeToken = async (payload) => handler(payload);
export const syncTransactionsForItem = async (payload) => handler(payload);
export const getUserAccounts = async (payload) => handler(payload);
export const getTransactionsForAccount = async (payload) => handler(payload);
export const getInstitutionById = (payload) => handler(payload);
