/**
 * request body for create user
 */
const request = {
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

export default request;
