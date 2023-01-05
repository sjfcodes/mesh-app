import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import axios from "axios";

import dynamoDb from "../../config/dynamoDb.mjs";
import {
  createTable,
  deleteTable,
  getTable,
} from "../../lambdas/crudDynamoDbTable/test/modules.mjs";
import {
  getTablePayload,
  createTablePayload,
  deleteTablePayload,
} from "../../lambdas/crudDynamoDbTable/test/payloads.mjs";
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemPayload,
} from "../../lambdas/crudDynamoDbTableItem/test/payloads.mjs";
import {
  createTableItem,
  deleteTableItem,
  getTableItem,
  updateTableItem,
} from "../../lambdas/crudDynamoDbTableItem/test/modules.mjs";

dotenv.config();

const testApi = process.env.USE_API_GATEWAY === "true";
console.log(`TESTING: ${testApi ? "AWS_API_GATEWAY" : "LOCAL"}`);

const {
  TableName,
  Item: { original, update },
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
    const { statusCode, body } = await (testApi
      ? apiTable({
          method: createTablePayload.httpMethod,
          data: createTablePayload,
        }).then(({ data }) => data)
      : createTable());

    if (statusCode !== 200) console.error(body);
    await new Promise((resolve) => setTimeout(resolve, 10000));

    expect(statusCode).toBe(200);
    expect(body.TableDescription.TableName).toBe(TableName);
  });

  it("should get table", async () => {
    const { statusCode, body } = await (testApi
      ? apiTable({
          method: getTablePayload.httpMethod,
          data: getTablePayload,
        }).then(({ data }) => data)
      : getTable());

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });
});

describe("add, edit, & delete items from table", () => {
  it("should create Item", async () => {
    const { statusCode, body } = await (testApi
      ? apiTableItem({
          method: createTableItemPayload.httpMethod,
          data: createTableItemPayload,
        }).then(({ data }) => data)
      : createTableItem());

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });

  it("should get Item", async () => {
    const { statusCode, body } = await (testApi
      ? apiTableItem({
          method: getTableItemPayload.httpMethod,
          data: getTableItemPayload,
        }).then(({ data }) => data)
      : getTableItem());

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
    expect(body.Item.someData.S).toBe(original.someData.S);
    expect(body.Item.email.S).toBe(original.email.S);
    expect(body.Item.username.S).toBe(original.username.S);
    expect(body.Item.verified.BOOL).toBe(original.verified.BOOL);
  });

  it("should update item", async () => {
    const updateExpression = {
      UpdateExpression: "SET verified = :v, someData = :sd",
      ExpressionAttributeValues: {
        ":v": update.verified,
        ":sd": update.someData,
      },
    };
    const payload = updateTableItemPayload(updateExpression);

    const { statusCode, body } = await (testApi
      ? apiTableItem({
          method: payload.httpMethod,
          data: payload,
        }).then(({ data }) => data)
      : updateTableItem(updateExpression));

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
    // expect unchanged
    expect(body.Attributes.email.S).toBe(original.email.S);
    // expect changed
    expect(body.Attributes.verified.BOOL).toBe(true);
    expect(body.Attributes.someData.S).toBe(update.someData.S);
  });

  it("should DELETE item from Table", async () => {
    const { statusCode, body } = await (testApi
      ? apiTableItem({
          method: deleteTableItemPayload.httpMethod,
          data: deleteTableItemPayload,
        }).then(({ data }) => data)
      : deleteTableItem());

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });
});

describe("destroy table", () => {
  it("should delete table", async () => {
    const { statusCode, body } = await (testApi
      ? apiTable({
          method: deleteTablePayload.httpMethod,
          data: deleteTablePayload,
        }).then(({ data }) => data)
      : deleteTable());

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });
});
