import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUser from '../hooks/useUser';

function Landing() {
  const {
    useUser: [user],
  } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.attributes?.email) {
      const url = `/user/${user.attributes.email}`;
      navigate(url);
      window.history.pushState({}, '', url);
    }
  }, [user, navigate]);

  return <p>...redirecting</p>;
}

export default Landing;
