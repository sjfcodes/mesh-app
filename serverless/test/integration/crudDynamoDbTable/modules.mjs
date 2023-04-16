import { handler } from "../../../lambdas/crudDynamoDbTable/index.mjs";

export const createUserTable = async (payload) => handler(payload);
export const readUserTable = async (payload) => handler(payload);
export const deleteUserTable = async (payload) => handler(payload);

export const createTransactionTable = async (payload) => handler(payload);
export const getTransactionTable = async (payload) => handler(payload);
export const deleteTransactionTable = async (payload) => handler(payload);
