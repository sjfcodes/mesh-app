import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUser from '../hooks/useUser';

function Landing() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.email) {
      const url = `/user/${user.email}`;
      navigate(url);
      window.history.pushState({}, '', url);
    }
  }, [user, navigate]);

  return <p>...redirecting</p>;
}

export default Landing;
