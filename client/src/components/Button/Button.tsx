import React, { ReactNode } from 'react';
import './Button.scss';

type props = {
  children: ReactNode;
  onClick: any;
};

const Button = ({ children, onClick }: props) => {
  return (
    <button className="mesh-button-default" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
