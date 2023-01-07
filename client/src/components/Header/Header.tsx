import { useAppContext } from '../../hooks/useUser';
import AppLogo from '../AppLogo/AppLogo';
import Button from '../Button/Button';

import './Header.css';

const Header = () => {
  const {
    useUser: [user],
    signOut,
  } = useAppContext();

  return (
    <header>
      <Button onClick={signOut}>SIGN OUT</Button>

      <div>
        <h4>env : {process.env.REACT_APP_PLAID_ENV}</h4>
        <h4>user: {user?.attributes?.email}</h4>
      </div>
      <AppLogo />
    </header>
  );
};

export default Header;
