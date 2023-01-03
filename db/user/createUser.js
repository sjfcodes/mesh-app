/**
 * request body for create user
 */
export default {
  body: {
    TableName: "mesh-app-users",
    Item: {
      email: {
        S: "samueljasonfox@gmail.com",
      },
      username: {
        S: "sjfox",
      },
    },
  },
  httpMethod: "PUT",
};
