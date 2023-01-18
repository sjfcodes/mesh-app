// import { useNavigate } from 'react-router-dom';
import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  // const navigate = useNavigate();
  const handleClick = () => {
    // navigate('/accounts');
    /**
     * navigate to accounts and reload does not work. 
     * FooterNav contains local state responsible for
     * keeping page url & selected app synced.
     * 
     * Would need to move local state to shared state
     * to allow other components to set selected app/url.
     */
    window.location.reload();
  };

  return (
    <header onClick={handleClick}>
      <div className="ma-header-left">
        <UserCard />
      </div>
      <h1>mesh</h1>
    </header>
  );
};

export default Header;
