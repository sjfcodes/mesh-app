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
      case 'PUT':
        switch (body.path) {
          case config.path.transactionsSync:
            const summary = await app.handleSyncTxsForItem();
            response = { tx_sync: 'complete', summary };
            break;

          default:
            throw Error(`path:"${body.path}" not found!`);
        }

        break;

      case 'POST':
        switch (body.path) {
          case config.path.linkTokenCreate:
            response = await app.getLinkToken();
            break;

          case config.path.linkTokenExchange:
            const { item_id } = await app.handleTokenExchange();
            response = { public_token_exchange: 'complete', item_id };
            break;

          default:
            throw Error(`path:"${body.path}" not found!`);
        }
        break;

      default:
        throw new Error(`Unsupported method: "${event.httpMethod}"`);
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
