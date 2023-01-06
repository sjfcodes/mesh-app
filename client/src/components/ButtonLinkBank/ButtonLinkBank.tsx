import React from 'react';
import Button from 'plaid-threads/Button';
import { useAppContext } from '../../services/currentUser';
import useLink from '../../hooks/useLink';

const ButtonLinkBank = () => {
  const {
    useUser: [
      {
        // @ts-ignore
        attributes: { sub: userId },
      },
    ],
  } = useAppContext();
  const { generateLinkToken /*, linkTokens*/ } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };
  return (
    <Button large inline className="add-account__button" onClick={initiateLink}>
      Add another bank
    </Button>
  );
};

export default ButtonLinkBank;
