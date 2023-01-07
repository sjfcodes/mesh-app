const userId = "02f25056-fe04-49a0-8c07-c509a245ff8e";
const config = {
  TableName: "mesh-app-users-test",
  Item: {
    original: {
      userId: { S: userId },
      username: { S: "bobbobberson" },
      email: { S: "test@jest.com" },
      verified: { BOOL: false },
      someData: { S: JSON.stringify({ hello: ["world"] }) },
    },
    update: {
      email: { S: "test0@jest.com" },
      verified: { BOOL: true },
      someData: { S: JSON.stringify({ hello: ["world", "human"] }) },
      plaidItems: {
        S: JSON.stringify([
          {
            publicToken: "public-sandbox-e4fb4ef9-c55c-4a1d-83b5-901103193ab8",
            institutionId: "ins_115585",
            userId,
            accounts: [
              {
                id: "AzlbBPkVG3hwXnNLJZXWfmJ3RzbeZwhoZGy4q",
                name: "Plaid Checking",
                mask: "0000",
                type: "depository",
                subtype: "checking",
                verification_status: null,
                class_type: null,
              },
              {
                id: "G4GBNMxzlPs6bxLyl5bJCdlJzjWowafnmE8GE",
                name: "Plaid Saving",
                mask: "1111",
                type: "depository",
                subtype: "savings",
                verification_status: null,
                class_type: null,
              },
            ],
          },
        ]),
      },
    },
  },
};

export default config;
