import config from './utils/config.js';
import App from './lib/App.js';

export const handler = async (event) => {
  const requestMethod = event.httpMethod;
  const requestPath = event.path;

  let response = {};
  let statusCode = 200;

  console.log(event);

  try {
    const app = new App(event);

    await app.setUserByToken(event.headers.Authorization);

    switch (requestMethod) {
      case 'GET':
        switch (requestPath) {
          case config.path.userItem:
            response.data = await app.handleGetItems();
            break;

          case config.path.itemInstitution:
            response.data = await app.handleGetItemInstitutionById();
            break;

          case config.path.itemAccount:
            response.data = await app.handleGetItemAccounts();
            break;

          case config.path.itemAccountBalance:
            response.data = await app.handleGetItemAccountBalances();
            break;

          case config.path.itemAccountTransaction:
            response.data = await app.handleGetUserAccountTransactions();
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      case 'PUT':
        switch (requestPath) {
          case config.path.itemSync:
            const summary = await app.handleUserItemSyncTransactions();
            response.data = { tx_sync: 'complete', ...summary };
            break;

          case config.path.itemSyncMock:
            const testSummary = await app.handleUserItemSyncTransactionsTest();
            response.data = { tx_sync: 'complete', ...testSummary };
            break;

          case config.path.itemUpdateLogin:
            response.data = await app.handleUpdateUserItemLogin();
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      case 'POST':
        switch (requestPath) {
          case config.path.itemAccount:
            response.data = await app.handleGetItemAccounts();
            break;

          case config.path.linkTokenCreate:
            response.data = await app.handleLinkTokenCreateUpdate();
            break;

          case config.path.itemTokenExchange:
            const { item_id } = await app.handleItemTokenExchange();
            response.data = { public_token_exchange: 'complete', item_id };
            break;

          case config.path.itemTokenExchangeMock:
            const { item_id: testItemId } =
              await app.handleItemTokenExchangeMock();
            response.data = {
              public_token_exchange: 'complete',
              item_id: testItemId,
            };
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      default:
        throw new Error(`Unsupported method: "${requestMethod}"`);
    }
  } catch (error) {
    console.error(error);
    response.message = error.message;
    if (error?.response?.data) {
      response = error.response.data;
    }
    statusCode = 500;
  }

  response.statusCode = statusCode;

  // must follow expected formatted response
  return {
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Content-Type': 'application/json',
    },
    statusCode,
  };
};
