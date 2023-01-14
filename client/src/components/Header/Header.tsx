import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  return (
    <header>
      <div className="ma-header-left">
        <UserCard />
      </div>
      <div className="ma-header-right">
        <h1>mesh</h1>
      </div>
    </header>
  );
};

export default Header;
