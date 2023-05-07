import { Auth } from 'aws-amplify';

import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  // const navigate = useNavigate();
  const reloadPage = () => {
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

  const copyAuthToClipboard = async () => {
    const auth = (await Auth.currentSession()).getIdToken().getJwtToken();
    navigator.clipboard.writeText(auth);
  };

  return (
    <header>
      <div>
        <div className="ma-header-left" onClick={reloadPage}>
          <UserCard />
        </div>
        <h1 onClick={copyAuthToClipboard}>⺵esh</h1>
      </div>
    </header>
  );
};

export default Header;
