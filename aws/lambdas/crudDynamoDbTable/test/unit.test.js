import { createTable, deleteTable, getTable } from "./modules.mjs";

describe("crudDynamoDbTable", () => {
  it("should create table", async () => {
    const { statusCode, body } = await createTable();
    expect(statusCode).toBe(200);
  });
  it("should get table", async () => {
    const { statusCode, body } = await getTable();

    expect(statusCode).toBe(200);
  });
  it("should delete table", async () => {
    const { statusCode, body } = await deleteTable();
    expect(statusCode).toBe(200);
  });
});
