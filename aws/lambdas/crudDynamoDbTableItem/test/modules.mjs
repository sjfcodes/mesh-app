import { handler } from "../index.mjs";
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemPayload,
} from "./payloads.mjs";

export const createTableItem = async () => handler(createTableItemPayload);

export const getTableItem = async () => handler(getTableItemPayload);

/**
 * @param {{ UpdateExpression, ExpressionAttributeValues }} expressionArgs
 * @returns
 */
export const updateTableItem = async (expressionArgs) =>
  handler(updateTableItemPayload(expressionArgs));

export const deleteTableItem = async () => handler(deleteTableItemPayload);
