import useUser from '../../hooks/useUser';
import AppLogo from '../AppLogo/AppLogo';
import Button from '../Button/Button';

import './Header.css';

const Header = () => {
  const { user, signOut } = useUser();

  const handleSignOut = async () => {
    if (signOut) signOut({ type: 'SIGN_OUT' });
    window.history.pushState({}, '', '/');
  };

  return (
    <header>
      <Button onClick={handleSignOut}>SIGN OUT</Button>

      <div>
        <h4>env : {process.env.REACT_APP_PLAID_ENV}</h4>
        <h4>user: {user.email}</h4>
      </div>
      <AppLogo />
    </header>
  );
};

export default Header;
