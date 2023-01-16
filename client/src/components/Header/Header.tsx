import { useNavigate } from 'react-router-dom';
import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header onClick={() => navigate('/')}>
      <div className="ma-header-left" onClick={() => window.location.reload()}>
        <UserCard />
      </div>
      <h1>mesh</h1>
    </header>
  );
};

export default Header;
