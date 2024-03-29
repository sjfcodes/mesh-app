import React, { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import useLink from '../../hooks/useLink';
import DefaultButton from '../Button/Default/DefaultButton';
import LaunchLink from '../LaunchLink';
import LinkTokenError from '../LinkTokenError';
import { ItemId } from '../../services/Plaid/Items/types';

type Props = {
  itemId: ItemId;
};

const ButtonUpdateItem = ({ itemId }: Props) => {
  const {
    user: { sub: userId },
  } = useUser();
  const { generateLinkToken, linkTokens, isLoading } = useLink();
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(linkTokens.byItem[itemId]);
  }, [linkTokens, itemId]);

  const initiateLink = async () => {
    // only generate a link token upon a click from end-user to add a bank;
    // if done earlier, it may expire before end-user actually activates Link to add a bank.
    await generateLinkToken(userId, itemId);
  };
  return (
    <>
      <DefaultButton onClick={initiateLink} isLoading={isLoading}>
        re-link
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
