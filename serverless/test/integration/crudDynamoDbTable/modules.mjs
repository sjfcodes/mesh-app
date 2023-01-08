import { handler } from "../../../lambdas/crudDynamoDbTable/index.mjs";
import {
  createTablePayload,
  deleteTablePayload,
  getTablePayload,
} from "./payloads.mjs";

export const createTable = async () => handler(createTablePayload);

export const deleteTable = async () => handler(deleteTablePayload);

export const getTable = async () => handler(getTablePayload);
