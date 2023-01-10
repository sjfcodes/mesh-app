import { handler } from "../../../lambdas/crudDynamoDbTable/index.mjs";

export const createTable = async (payload) => handler(payload);
export const deleteTable = async (payload) => handler(payload);
export const getTable = async (payload) => handler(payload);
