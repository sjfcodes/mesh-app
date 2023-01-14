import React from 'react';
import useLink from '../../hooks/useLink';
import useUser from '../../hooks/useUser';
import AppButton from '../Button/App/AppButton';
import { GiExitDoor } from 'react-icons/gi';
import { BsBank, BsBoxSeam } from 'react-icons/bs';

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
      <div>
        <div className="sections">
          <AppButton label="banks" onClick={handleInitiateLink}>
            <BsBank size={iconSize} />
          </AppButton>
          <AppButton label="demo 1" onClick={() => null}>
            <BsBoxSeam size={iconSize} />
          </AppButton>
          <AppButton label="demo 2" onClick={() => null}>
            <BsBoxSeam size={iconSize} />
          </AppButton>
          <AppButton label="demo 3" onClick={() => null}>
            <BsBoxSeam size={iconSize} />
          </AppButton>
          <AppButton label="demo 4" onClick={() => null}>
            <BsBoxSeam size={iconSize} />
          </AppButton>
          <AppButton label="demo 5" onClick={() => null}>
            <BsBoxSeam size={iconSize} />
          </AppButton>
          <AppButton label="demo 6" onClick={() => null}>
            <BsBoxSeam size={iconSize} />
          </AppButton>
        </div>
        <div className="sign-out">
          <AppButton label="sign out" onClick={handleSignOut}>
            <GiExitDoor size={iconSize} />
          </AppButton>
        </div>
      </div>
    </footer>
  );
};

export default NavBar;
