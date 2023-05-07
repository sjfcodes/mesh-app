import { Auth } from 'aws-amplify';

import UserCard from '../UserCard/UserCard';

import './style.scss';

const Header = () => {
  // const navigate = useNavigate();
  const reloadPage = () => {
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
