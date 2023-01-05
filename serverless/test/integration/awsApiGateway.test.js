import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import axios from "axios";

import dynamoDb from "../../config/dynamoDb.mjs";
import {
  createTablePayload,
  getTablePayload,
  deleteTablePayload,
} from "../../aws/lambdas/crudDynamoDbTable/test/payloads.mjs";
import {
  createTableItemPayload,
  deleteTableItemPayload,
  getTableItemPayload,
  updateTableItemPayload,
} from "../../aws/lambdas/crudDynamoDbTableItem/test/payloads.mjs";

dotenv.config();

const {
  TableName,
  Item: { original, update },
} = dynamoDb;

const api = axios.create({
  baseURL: process.env.AWS_API_GATEWAY,
  headers: { Authorization: process.env.AUTH_TOKEN },
});

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
    const {
      data: { statusCode, body },
    } = await apiTable({
      method: createTablePayload.httpMethod,
      data: createTablePayload,
    });

    if (statusCode !== 200) console.error(body);
    await new Promise((resolve) => setTimeout(resolve, 10000));

    expect(statusCode).toBe(200);
    expect(body.TableDescription.TableName).toBe(TableName);
  });

  it("should get table", async () => {
    const {
      data: { statusCode, body },
    } = await apiTable({
      method: getTablePayload.httpMethod,
      data: getTablePayload,
    });

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });
});

describe("add, edit, & delete items from table", () => {
  it("should create Item", async () => {
    const {
      data: { statusCode, body },
    } = await apiTableItem({
      method: createTableItemPayload.httpMethod,
      data: createTableItemPayload,
    });

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });

  it("should get Item", async () => {
    const {
      data: { statusCode, body },
    } = await apiTableItem({
      method: getTableItemPayload.httpMethod,
      data: getTableItemPayload,
    });

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
    expect(body.Item.someData.S).toBe(original.someData.S);
    expect(body.Item.email.S).toBe(original.email.S);
    expect(body.Item.username.S).toBe(original.username.S);
    expect(body.Item.verified.BOOL).toBe(original.verified.BOOL);
  });

  it("should update item", async () => {
    const payload = updateTableItemPayload({
      UpdateExpression: "SET verified = :v, someData = :sd",
      ExpressionAttributeValues: {
        ":v": update.verified,
        ":sd": update.someData,
      },
    });

    const {
      data: { statusCode, body },
    } = await apiTableItem({
      method: payload.httpMethod,
      data: payload,
    });

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
    // expect unchanged
    expect(body.Attributes.email.S).toBe(original.email.S);
    // expect changed
    expect(body.Attributes.verified.BOOL).toBe(true);
    expect(body.Attributes.someData.S).toBe(update.someData.S);
  });

  it("should DELETE item from Table", async () => {
    const {
      data: { statusCode, body },
    } = await apiTableItem({
      method: deleteTableItemPayload.httpMethod,
      data: deleteTableItemPayload,
    });

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });
});

describe("destroy table", () => {
  it("should delete table", async () => {
    const {
      data: { statusCode, body },
    } = await apiTable({
      method: deleteTablePayload.httpMethod,
      data: deleteTablePayload,
    });

    if (statusCode !== 200) console.error(body);

    expect(statusCode).toBe(200);
  });
});
