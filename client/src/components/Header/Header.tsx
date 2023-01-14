import { useNavigate } from 'react-router-dom';
import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header onClick={() => navigate('/')}>
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
