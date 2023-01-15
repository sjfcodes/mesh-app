import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import './style.scss';

type props = {
  children: ReactNode;
  label: string;
  toRoute: string;
};

const AppButton = ({ children, label, toRoute }: props) => {
  const navigate = useNavigate();
  const { signOut } = useUser();

  const handleRoute = async () => {
    let route = toRoute;
    if (toRoute === '/exit') {
      if (signOut) signOut({ type: 'SIGN_OUT' });
      route = '/';
    }
    navigate(route);
  };

  return (
    <div className="ma-button-app">
      <button onClick={handleRoute}>{children}</button>
      <label>{label}</label>
    </div>
  );
};

export default AppButton;
