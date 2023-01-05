const config = {
  TableName: "mesh-app-users-test",
  Item: {
    original: {
      username: { S: "sjfox" },
      email: { S: "test@jest.com" },
      verified: { BOOL: false },
      someData: { S: JSON.stringify({ hello: ["world"] }) },
    },
    update: {
      email: { S: "test0@jest.com" },
      verified: { BOOL: true },
      someData: { S: JSON.stringify({ hello: ["world", "human",] }) },
    },
  },
};

export default config;
