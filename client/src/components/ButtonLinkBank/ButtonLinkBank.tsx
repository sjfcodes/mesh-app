import React from 'react';
import Button from 'plaid-threads/Button';
import useUser from '../../hooks/useUser';
import useLink from '../../hooks/useLink';

const ButtonLinkBank = () => {
  const {
    user: { sub: userId },
  } = useUser();
  const { generateLinkToken /*, linkTokens*/ } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from end-user to add a bank;
    // if done earlier, it may expire before end-user actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };
  return (
    <Button large showLoader onClick={initiateLink}>
      Add another bank
    </Button>
  );
};

export default ButtonLinkBank;
