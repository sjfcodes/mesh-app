import React, { MouseEventHandler, ReactNode } from 'react';
import './style.scss';
import Loader from '../../Loader/Loader';

type props = {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
};

const DefaultButton = ({ children, onClick, isLoading }: props) => {
  return (
    <button
      className="ma-button-default"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
};

export default DefaultButton;
