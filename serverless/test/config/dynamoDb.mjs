import * as dotenv from "dotenv";

dotenv.config();

const config = {
  TableName: "mesh-app-users-test",
  Item: {
    original: {
      email: { S: "sjfcodes@gmail.com" },
      someData: { S: JSON.stringify({ hello: ["world"] }) },
      userId: { S: "02f25056-fe04-49a0-8c07-c509a245ff8e" },
      username: { S: "bobbobberson" },
      verified: { BOOL: false },
    },
    update: {
      email: { S: "sjfcodes@gmail.com" },
      someData: { S: JSON.stringify({ hello: ["world", "human"] }) },
      verified: { BOOL: true },
    },
  },
  params: { header: { Authorization: process.env.AUTH_TOKEN } },
};

export default config;
