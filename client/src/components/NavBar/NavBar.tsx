import React from 'react';
import useLink from '../../hooks/useLink';
import useUser from '../../hooks/useUser';
import AppButton from '../Button/App/AppButton';
import { GiExitDoor } from 'react-icons/gi';
import { BsBank } from 'react-icons/bs';

import './style.scss';

const iconSize = '2em';

const NavBar = () => {
  const { user, signOut } = useUser();
  const { generateLinkToken } = useLink();
  const handleInitiateLink = async () => {
    await generateLinkToken(user.sub, null);
  };

  const handleSignOut = async () => {
    if (signOut) signOut({ type: 'SIGN_OUT' });
    window.history.pushState({}, '', '/');
  };

  return (
    <footer>
      <AppButton label="banks" onClick={handleInitiateLink}>
        <BsBank size={iconSize} />
      </AppButton>
      <AppButton label="sign out" onClick={handleSignOut}>
        <GiExitDoor size={iconSize} />
      </AppButton>
    </footer>
  );
};

export default NavBar;
