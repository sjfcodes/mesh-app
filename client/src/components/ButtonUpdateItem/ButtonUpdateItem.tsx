import React, { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import useLink from '../../hooks/useLink';
import DefaultButton from '../Button/Default/DefaultButton';
import LaunchLink from '../LaunchLink';
import LinkTokenError from '../LinkTokenError';

type Props = {
  itemId: string;
};

const ButtonUpdateItem = ({ itemId }: Props) => {
  const {
    user: { sub: userId },
  } = useUser();
  const { generateLinkToken, linkTokens } = useLink();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setToken(linkTokens.byItem[itemId]);
  }, [linkTokens, itemId]);

  const initiateLink = async () => {
    setIsLoading(true);
    // only generate a link token upon a click from end-user to add a bank;
    // if done earlier, it may expire before end-user actually activates Link to add a bank.
    await generateLinkToken(userId, itemId);
    setIsLoading(false);
  };
  return (
    <>
      <DefaultButton onClick={initiateLink} isLoading={isLoading}>
        Update Login
      </DefaultButton>

      {token != null && token.length > 0 && (
        // Link will not render unless there is a link token
        <LaunchLink token={token} userId={userId} itemId={itemId} />
      )}
      {linkTokens.error.error_code != null && (
        <LinkTokenError error={linkTokens.error} />
      )}
    </>
  );
};

export default ButtonUpdateItem;
