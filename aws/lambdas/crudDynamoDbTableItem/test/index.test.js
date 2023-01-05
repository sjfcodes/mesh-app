import { createTableItem, deleteTableItem, getTableItem, updateTableItem } from "./modules.mjs";
import dynamoDb from "../../../../config/dynamoDb.mjs";

const {
  Item: { original, update },
} = dynamoDb;

describe("testFunction", () => {
  it("should create Item", async () => {
    const { statusCode, body } = await createTableItem();

    expect(statusCode).toBe(200);
  });

  it("should get Item", async () => {
    const { statusCode, body } = await getTableItem();

    expect(statusCode).toBe(200);
    expect(body.Item.someData.S).toBe(original.someData.S);
    expect(body.Item.email.S).toBe(original.email.S);
    expect(body.Item.username.S).toBe(original.username.S);
    expect(body.Item.verified.BOOL).toBe(original.verified.BOOL);
  });

  it("should update item", async () => {
    const { statusCode, body } = await updateTableItem({
      UpdateExpression: "SET verified = :v, someData = :sd",
      ExpressionAttributeValues: { ":v": update.verified, ":sd": update.someData },
    });
    expect(statusCode).toBe(200);
    // expect unchanged
    expect(body.Attributes.email.S).toBe(original.email.S);
    // expect changed
    expect(body.Attributes.verified.BOOL).toBe(true);
    expect(body.Attributes.someData.S).toBe(update.someData.S);
  });

  it("should DELETE item from Table", async () => {
    const { statusCode } = await deleteTableItem()

    expect(statusCode).toBe(200);
  });
});
