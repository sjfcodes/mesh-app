import * as dotenv from "dotenv";
import axios from "axios";

import dynamoDb from "../config/dynamoDb.mjs";
import {
  createTable,
  deleteTable,
  getTable,
} from "./crudDynamoDbTable/modules.mjs";
import {
  getTablePayload,
  createTablePayload,
  deleteTablePayload,
} from "./crudDynamoDbTable/payloads.mjs";
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemRandomPayload,
} from "./crudDynamoDbTableItem/payloads.mjs";
import {
  createTableItem,
  deleteTableItem,
  getTableItem,
  updateTableItemRandomItem,
} from "./crudDynamoDbTableItem/modules.mjs";
import { exchangeTokenLinkPayload } from "./crudPlaidLink/payloads.mjs";
import { exchangeToken } from "./crudPlaidLink/modules.mjs";

dotenv.config();

const testApi = process.env.USE_API_GATEWAY === "true";
console.log(`TESTING: ${testApi ? "AWS_API_GATEWAY" : "LOCAL"}`);

const {
  TableName,
  Item: { original, update, writePlaidItems },
} = dynamoDb;

const apiTable = axios.create({
  baseURL: process.env.AWS_API_GATEWAY + "/dynamodbtable",
  headers: { Authorization: process.env.AUTH_TOKEN },
});

const apiTableItem = axios.create({
  baseURL: process.env.AWS_API_GATEWAY + "/dynamodbtableitem",
  headers: { Authorization: process.env.AUTH_TOKEN },
});

describe("create and read table", () => {
  it("should create table", async () => {
    const { status_code, body } = await (testApi
      ? apiTable({
          method: createTablePayload.context["http-method"],
          data: createTablePayload,
        }).then(({ data }) => data)
      : createTable());

    if (status_code !== 200) console.error(body);
    await new Promise((resolve) => setTimeout(resolve, 10000));

    expect(status_code).toBe(200);
    expect(body.TableDescription.TableName).toBe(TableName);
  });

  it("should get table", async () => {
    const { status_code, body } = await (testApi
      ? apiTable({
          method: getTablePayload.context["http-method"],
          data: getTablePayload,
        }).then(({ data }) => data)
      : getTable());

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
  });
});

describe("create, edit, & delete items from table", () => {
  it("should create Item", async () => {
    const { status_code, body } = await (testApi
      ? apiTableItem({
          method: createTableItemPayload.context["http-method"],
          data: createTableItemPayload,
        }).then(({ data }) => data)
      : createTableItem());

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
  });

  it("should get Item", async () => {
    const { status_code, body } = await (testApi
      ? apiTableItem({
          method: getTableItemPayload.context["http-method"],
          data: getTableItemPayload,
        }).then(({ data }) => data)
      : getTableItem());

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
    expect(body.Item.someData.S).toBe(original.someData.S);
    expect(body.Item.email.S).toBe(original.email.S);
    expect(body.Item.username.S).toBe(original.username.S);
    expect(body.Item.verified.BOOL).toBe(original.verified.BOOL);
  });

  it("should update item with existing properties", async () => {
    const { status_code, body } = await (testApi
      ? apiTableItem({
          method: updateTableItemRandomPayload.context["http-method"],
          data: updateTableItemRandomPayload,
        }).then(({ data }) => data)
      : updateTableItemRandomItem(updateTableItemRandomPayload));

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
    // expect unchanged
    expect(body.Attributes.email.S).toBe(original.email.S);
    // expect changed
    expect(body.Attributes.verified.BOOL).toBe(true);
    expect(body.Attributes.someData.S).toBe(update.someData.S);
  });

  it("should update item with new property", async () => {
    const { status_code, body } = await (testApi
      ? apiTableItem({
          method: exchangeTokenLinkPayload.context["http-method"],
          data: exchangeTokenLinkPayload,
        }).then(({ data }) => data)
      : exchangeToken());

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
    // expect unchanged
    expect(body.Attributes.email.S).toBe(original.email.S);
    // expect changed
    expect(body.Attributes.plaidItems.S).toBe(
      JSON.stringify(exchangeTokenLinkPayload.body.payload)
    );
  });

  it("should DELETE item from Table", async () => {
    const { status_code, body } = await (testApi
      ? apiTableItem({
          method: deleteTableItemPayload.context["http-method"],
          data: deleteTableItemPayload,
        }).then(({ data }) => data)
      : deleteTableItem());

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
  });
});

describe("destroy table", () => {
  it("should delete table", async () => {
    const { status_code, body } = await (testApi
      ? apiTable({
          method: deleteTablePayload.context["http-method"],
          data: deleteTablePayload,
        }).then(({ data }) => data)
      : deleteTable());

    if (status_code !== 200) console.error(body);

    expect(status_code).toBe(200);
  });
});
