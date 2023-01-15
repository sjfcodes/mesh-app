import { Callout } from 'plaid-threads';
import React from 'react';
import { PlaidLinkError } from 'react-plaid-link';
type Props = {
  error: PlaidLinkError;
};

const LinkTokenError = ({ error }: Props) => {
  return (
    <Callout warning>
      <div>
        Unable to fetch link_token: please make sure your backend server is
        running and that your .env file has been configured correctly.
      </div>
      <div>
        Error Code: <code>{error.error_code}</code>
      </div>
      <div>
        Error Type: <code>{error.error_type}</code>{' '}
      </div>
      <div>Error Message: {error.error_message}</div>
    </Callout>
  );
};

export default LinkTokenError;
