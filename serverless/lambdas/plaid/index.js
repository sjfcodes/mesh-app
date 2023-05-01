import config from './utils/config.js';
import App from './lib/App.js';

export const handler = async (event) => {
  const requestMethod = event.httpMethod;
  const requestPath = event.path;

  let response = {
    body: {},
  };
  let statusCode = 200;

  console.log(event);

  try {
    const app = new App(event);

    await app.setUserByToken(event.headers.Authorization);

    switch (requestMethod) {
      case 'GET':
        switch (requestPath) {
          case config.path.userItem:
            response.body = await app.handleGetItems();
            break;

          case config.path.itemInstitution:
            response.body = await app.handleGetItemInstitutionById();
            break;

          case config.path.itemAccount:
            response.body = await app.handleGetItemAccounts();
            break;

          case config.path.itemAccountBalance:
            response.body = await app.handleGetItemAccountBalances();
            break;

          case config.path.itemAccountTransaction:
            response.body = await app.handleGetUserAccountTransactions();
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      case 'PUT':
        switch (requestPath) {
          case config.path.itemTransactionSync:
            const summary = await app.handleUserItemSyncTransactions();
            response.body = { tx_sync: 'complete', ...summary };
            break;

          case config.path.testItemTransactionSync:
            const testSummary = await app.handleUserItemSyncTransactionsTest();
            response.body = { tx_sync: 'complete', ...testSummary };
            break;

          case config.path.itemUpdateLogin:
            response.body = await app.handleUpdateUserItemLogin();
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      case 'POST':
        switch (requestPath) {
          case config.path.itemAccount:
            response.body = await app.handleGetItemAccounts();
            break;

          case config.path.linkTokenCreate:
            response.body = await app.handleLinkTokenCreateUpdate();
            break;

          case config.path.itemTokenExchange:
            const { item_id } = await app.handleItemTokenExchange();
            response.body = { public_token_exchange: 'complete', item_id };
            break;

          case config.path.itemTokenExchangeTest:
            const { item_id: testItemId } =
              await app.handleItemTokenExchangeTest();
            response.body = {
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
    response.body.message = error.message;
    if (error?.response) {
      response.body = error.response;
    }
    statusCode = 500;
  }

  response.body.statusCode = statusCode;

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
