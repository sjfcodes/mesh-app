import React, { ReactNode } from 'react';
import './style.scss';

type props = {
  children: ReactNode;
  label: string;
  onClick: any;
};

const AppButton = ({ children, label, onClick }: props) => {
  return (
      <div className="ma-button-app">
        <button onClick={onClick}>{children}</button>
        <label>{label}</label>
      </div>
  );
};

export default AppButton;
