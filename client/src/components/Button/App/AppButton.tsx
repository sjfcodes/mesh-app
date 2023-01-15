import React, { ReactNode } from 'react';
import './style.scss';

type props = {
  children: ReactNode;
  label: string;
  className: string;
  onClick: () => void;
};

const AppButton = ({ children, label, className, onClick }: props) => {
  return (
    <div className="ma-button-app">
      <button className={className} onClick={onClick}>
        {children}
      </button>
      <label>{label}</label>
    </div>
  );
};

export default AppButton;
