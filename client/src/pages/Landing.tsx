import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../hooks/useUser';

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

  return <p>...redirecting</p>;
}

export default Landing;
