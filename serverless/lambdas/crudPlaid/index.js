import config from './utils/config.js';
import App from './lib/App.js';

export const handler = async (event) => {
  let response = event.body;
  let statusCode = 200;

  try {
    const app = new App(event);
    const requestMethod = event.context['http-method'];
    const requestPath = event.context['resource-path'];

    await app.setUserByToken(event.params.header.Authorization);

    switch (requestMethod) {
      case 'GET':
        switch (requestPath) {
          case config.path.userItem:
            response = await app.handleGetItems();
            break;

          case config.path.itemInstitution:
            response = await app.handleGetItemInstitutionById();
            break;

          case config.path.itemAccount:
            response = await app.handleGetItemAccounts();
            break;

          case config.path.itemAccountBalance:
            response = await app.handleGetItemAccountBalances();
            break;

          case config.path.itemAccountTransaction:
            response = await app.handleGetUserAccountTransactions();
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      case 'PUT':
        switch (requestPath) {
          case config.path.itemTransactionSync:
            const summary = await app.handleUserItemSyncTransactions();
            response = { tx_sync: 'complete', ...summary };
            break;

          case config.path.testItemTransactionSync:
            const testSummary = await app.handleUserItemSyncTransactionsTest();
            response = { tx_sync: 'complete', ...testSummary };
            break;

          case config.path.itemUpdateLogin:
            response = await app.handleUpdateUserItemLogin();
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      case 'POST':
        switch (requestPath) {
          case config.path.itemAccount:
            response = await app.handleGetItemAccounts();
            break;

          case config.path.linkTokenCreate:
            response = await app.handleLinkTokenCreateUpdate();
            break;

          case config.path.itemTokenExchange:
            const { item_id } = await app.handleItemTokenExchange();
            response = { public_token_exchange: 'complete', item_id };
            break;

          case config.path.itemTokenExchangeTest:
            const { item_id: testItemId } =
              await app.handleItemTokenExchangeTest();
            response = {
              public_token_exchange: 'complete',
              item_id: testItemId,
            };
            break;

          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }
        break;

      default:
        throw new Error(
          `Unsupported method: "${event.context['http-method']}"`
        );
    }
  } catch (error) {
    response = error;
    if (error?.response) {
      response = error.response;
    }
    console.error(response);
    statusCode = 400;
  }

  return {
    body: response,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Content-Type': 'application/json',
    },
    path: event.path,
    status_code: statusCode,
  };
};
