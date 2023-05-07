import config from './utils/config.js';
import App from './lib/App.js';

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';

const routeMap = {
  [config.path.item]: {
    [GET]: 'getItems',
  },
  [config.path.itemInstitution]: {
    [GET]: 'getInstitutionById',
  },
  [config.path.itemAccountBalance]: {
    [GET]: 'getBalancesByAccountId',
  },
  [config.path.itemAccountTransaction]: {
    [GET]: 'getTransactionsByAccountId',
  },
  [config.path.itemSync]: {
    [PUT]: 'syncTransactionsByItemId',
  },
  [config.path.itemSyncMock]: {
    [PUT]: 'testSyncTransactionsByItemId',
  },
  [config.path.itemUpdateLogin]: {
    [PUT]: 'updateItemLogin',
  },
  [config.path.linkTokenCreate]: {
    [POST]: 'linkTokenCreate',
  },
  [config.path.itemTokenExchange]: {
    [POST]: 'exchangeTokenCreateItem',
  },
  [config.path.itemTokenExchangeMock]: {
    [POST]: 'testExchangeTokenCreateItem',
  },
};

export const handler = async (event) => {
  let response = {};
  let statusCode = 200;

  try {
    const app = new App(event);
    await app.setUserByToken(event.headers.Authorization);

    /**
     * @type {string}
     */
    const requestMethod = event.httpMethod;
    if (!requestMethod) throw new Error('missing requestMethod');

    /**
     * @type {string}
     */
    const requestPath = event.path;
    if (!requestPath) throw new Error('missing requestPath');

    console.log(requestMethod, ':', requestPath);

    /**
     * @type {string}
     */
    const classMethod = routeMap[requestPath][requestMethod];
    if (!classMethod) throw new Error('missing classMethod');

    response.data = await app[classMethod]();
  } catch (error) {
    console.error(error);
    response.message = error.message;
    if (error?.response?.data) {
      response = error.response.data;
    }
    statusCode = 500;
  }

  // must follow expected formatted response
  return {
    body: JSON.stringify({ ...response, statusCode }),
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Content-Type': 'application/json',
    },
    statusCode,
  };
};
