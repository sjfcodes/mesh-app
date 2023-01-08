import { handler } from "../../../lambdas/crudDynamoDbTableItem/index.mjs";
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemRandomPayload,
} from "./payloads.mjs";

export const createTableItem = async () => handler(createTableItemPayload);

export const getTableItem = async () => handler(getTableItemPayload);

export const updateTableItemRandomItem = async () =>
  handler(updateTableItemRandomPayload);

export const deleteTableItem = async () => handler(deleteTableItemPayload);
