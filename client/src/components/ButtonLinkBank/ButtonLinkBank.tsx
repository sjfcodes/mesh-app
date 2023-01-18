import React, { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import useLink from '../../hooks/useLink';
import DefaultButton from '../Button/Default/DefaultButton';
import LaunchLink from '../LaunchLink';
import LinkTokenError from '../LinkTokenError';

const ButtonLinkBank = () => {
  const {
    user: { sub: userId },
  } = useUser();
  const { generateLinkToken, linkTokens } = useLink();
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId]);

  const initiateLink = async () => {
    // only generate a link token upon a click from end-user to add a bank;
    // if done earlier, it may expire before end-user actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };
  return (
    <>
      <DefaultButton onClick={initiateLink}>Add another bank</DefaultButton>

      {token != null && token.length > 0 && (
        // Link will not render unless there is a link token
        <LaunchLink token={token} userId={userId} itemId={null} />
      )}
      {linkTokens.error.error_code != null && (
        <LinkTokenError error={linkTokens.error} />
      )}
    </>
  );
};

export default ButtonLinkBank;
