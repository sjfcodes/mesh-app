import { handler } from './index.mjs';

describe('crudDynamoDbTable', () => {
  it('should have body property', async () => {
    const response = await handler({ body: { hello: 'world' }});
    expect(response).toHaveProperty('body');
  });
});
