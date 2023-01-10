import config from './utils/config.mjs';
import App from './lib/App.mjs';

export const handler = async (event) => {
  let response = event.body;
  let statusCode = 200;

  try {
    const { body } = event;
    const app = new App(body.payload);
    await app.setUserByToken(event.params.header.Authorization);

    switch (event.context['http-method']) {
      case 'GET':
        switch (event.context['resource-path']) {
          case config.path.itemGetAccounts:
            response = await app.handleGetUserAccounts();

            break;
          default:
            throw Error(`path:"${body.path}" not found!`);
        }

        break;
      case 'PUT':
        switch (body.path) {
          case config.path.itemTxSync:
            const summary = await app.handleSyncTxsForItem();
            response = { tx_sync: 'complete', summary };

            break;
          default:
            throw Error(`path:"${body.path}" not found!`);
        }

        break;
      case 'POST':
        switch (body.path) {
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
          default:
            throw Error(`path:"${body.path}" not found!`);
        }

        break;
      default:
        throw new Error(
          `Unsupported method: "${event.context['http-method']}"`
        );
    }
  } catch (error) {
    console.error(error);
    response = error.message;
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
