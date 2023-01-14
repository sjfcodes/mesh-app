import AppLogo from '../AppLogo/AppLogo';
import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  return (
    <header>
      <div className="ma-header-left">
        <AppLogo />
        <UserCard />
      </div>
      <div className="ma-header-right">
        <h1>mesh</h1>
      </div>
    </header>
  );
};

export default Header;
