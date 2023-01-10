import { handler } from "../../../lambdas/crudDynamoDbTableItem/index.mjs";
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemPayload,
} from "./payloads.mjs";

export const createTableItem = async () => handler(createTableItemPayload);

export const getTableItem = async () => handler(getTableItemPayload);

export const updateTableItemItem = async () =>
  handler(updateTableItemPayload);

export const deleteTableItem = async () => handler(deleteTableItemPayload);
