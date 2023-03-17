import config from './utils/config.mjs';
import App from './lib/App.mjs';

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
          case config.path.getItems:
            response = await app.handleGetUserItems();

            break;
          case config.path.itemGetInstitution:
            response = await app.handleGetInstitutionById();

            break;
          case config.path.itemGetAccounts:
            response = await app.handleGetUserAccounts();

            break;
          case config.path.getAccountBalances:
            response = await app.handleGetAccountBalances();

            break;
          case config.path.getAccountTransactions:
            response = await app.handleGetAccountTransactions();

            break;
          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }

        break;
      case 'PUT':
        switch (requestPath) {
          case config.path.itemTxSync:
            const summary = await app.handleItemSyncTransactions();
            response = { tx_sync: 'complete', ...summary };

            break;
          case config.path.itemTxSyncTest:
            const testSummary = await app.mockHandleItemSyncTransactions();
            response = { tx_sync: 'complete', ...testSummary };

            break;
          case config.path.itemUpdateLogin:
            response = await app.handleUpdateItemLogin();

            break;
          default:
            throw Error(`requestPath:"${requestPath}" not found!`);
        }

        break;
      case 'POST':
        switch (requestPath) {
          case config.path.itemGetAccounts:
            response = await app.handleGetItemAccounts();

            break;
          case config.path.linkTokenCreate:
            response = await app.getLinkToken();

            break;
          case config.path.itemTokenExchange:
            const { item_id } = await app.handleTokenExchange();
            response = { public_token_exchange: 'complete', item_id };

            break;
          case config.path.itemTokenExchangeTest:
            const { item_id: testItemId } = await app.mockHandleTokenExchange();
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
    console.error(error);
    response = error;
    if (error?.response?.data) {
      response = error.response.data;
    }
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
