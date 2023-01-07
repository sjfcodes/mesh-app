import React, { useEffect /* useEffect */ } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header/Header';
// import ButtonLinkBank from '../components/ButtonLinkBank/ButtonLinkBank';
import { useAppContext } from '../hooks/useUser';
// import useApi from '../hooks/useApi';

function Landing() {
  const {
    useUser: [user],
  } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.attributes?.email) {
      navigate(`/user/${user.attributes.email}`);
    }
  }, [user, navigate]);

  return (
    <div>
      <p>...redirecting</p>
    </div>
  );
}

export default Landing;
