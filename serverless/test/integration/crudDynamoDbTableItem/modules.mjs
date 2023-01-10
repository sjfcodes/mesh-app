import { handler } from '../../../lambdas/crudDynamoDbTableItem/index.mjs';

export const createTableItem = async (payload) => handler(payload);
export const getTableItem = async (payload) => handler(payload);
export const updateTableItemItem = async (payload) => handler(payload);
export const deleteTableItem = async (payload) => handler(payload);
