import { createTokenLink } from "./test/modules.mjs";
import config from "./utils/config.mjs";

describe("crudPlaidLink", () => {
  it("should return plaid link token object", async () => {
    const { status_code, body, path } = await createTokenLink();
    // example body:
    // {
    //   expiration: '2023-01-06T02:58:09Z',
    //   link_token: 'link-sandbox-7162a79c-8b7a-4722-a6b6-82621c0f0279',
    //   request_id: 'GL6JcUAcW8neE5x'
    // }
    console.log(body);
    expect(status_code).toBe(200);
    expect(body.expiration).not.toBe(undefined);
    expect(body.link_token).not.toBe(undefined);
    expect(body.request_id).not.toBe(undefined);
  });
});
