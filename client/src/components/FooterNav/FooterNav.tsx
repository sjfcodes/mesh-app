import React from 'react';

import AppButton from '../Button/App/AppButton';
import { GiExitDoor } from 'react-icons/gi';
import { BsBank, BsBoxSeam } from 'react-icons/bs';
import { HiOutlinePresentationChartLine } from 'react-icons/hi';

import './style.scss';

const iconSize = '2em';

const NavBar = () => {
  return (
    <footer>
      <div>
        <div className="sign-out">
          <AppButton label="sign out" toRoute="/exit">
            <GiExitDoor size={iconSize} />
          </AppButton>
        </div>
        <div className="sections">
          <AppButton label="banks" toRoute="/items">
            <BsBank size={iconSize} />
          </AppButton>
          <AppButton label="spending" toRoute="/spending">
            <HiOutlinePresentationChartLine size={iconSize} />
          </AppButton>
          <AppButton label="demo 2" toRoute="/">
            <BsBoxSeam size={iconSize} />
          </AppButton>
        </div>
      </div>
    </footer>
  );
};

export default NavBar;
