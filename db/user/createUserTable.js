/**
 * request body for creating user table via dynamodb
 */
const request = {
  body: {
    AttributeDefinitions: [
      {
        AttributeName: "email",
        AttributeType: "S",
      },
      {
        AttributeName: "username",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "email",
        KeyType: "HASH",
      },
      {
        AttributeName: "username",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: "mesh-app-users",
    StreamSpecification: {
      StreamEnabled: false,
    },
  },
  httpMethod: "PUT",
};

export default request;
