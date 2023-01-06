import { useAppContext } from '../../services/currentUser';
import AppLogo from '../AppLogo/AppLogo';

import './Header.css';

const Header = () => {
  const {
    useUser: [user],
    signOut,
  } = useAppContext();

  return (
    <header>
      <AppLogo />
      <div>
        <h4>env : {process.env.REACT_APP_PLAID_ENV}</h4>
        <h4>user: {user?.attributes?.email}</h4>
      </div>
      <button onClick={signOut}>Sign out</button>
    </header>
  );
};

export default Header;
