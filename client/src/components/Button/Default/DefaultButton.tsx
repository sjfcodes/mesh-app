import React, { ReactNode } from 'react';
import './style.scss';

type props = {
  children: ReactNode;
  onClick: any;
};

const DefaultButton = ({ children, onClick }: props) => {
  return (
    <button className="ma-button-default" onClick={onClick}>
      {children}
    </button>
  );
};

export default DefaultButton;
