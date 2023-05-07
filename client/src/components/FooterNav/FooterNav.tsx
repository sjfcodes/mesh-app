import React, { useEffect, useState } from 'react';

import AppButton from '../Button/App/AppButton';
import { GiExitDoor } from 'react-icons/gi';
import { BsBank, BsListOl } from 'react-icons/bs';
import { HiOutlinePresentationChartLine } from 'react-icons/hi';

import './style.scss';
import { useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import { ROUTE } from '../../util/constants';

const iconSize = '2em';

const FooterNav = () => {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const [selected, setSelected] = useState(
    localStorage.getItem('ma-selected-app') || ''
  );

  useEffect(() => {
    navigate(selected);
  }, [navigate, selected]);

  const handleSelection = async (toRoute: string) => {
    let route = toRoute;
    if (toRoute === '/exit') {
      if (signOut) signOut({ type: 'SIGN_OUT' });
      route = '/';
    }
    localStorage.setItem('ma-selected-app', route);
    setSelected(route);
  };
  return (
    <footer>
      <div>
        <div className="sign-out">
          <AppButton
            label="sign out"
            className={selected === '/exit' ? 'ma-border-1-0' : ''}
            onClick={() => handleSelection('/exit')}
          >
            <GiExitDoor size={iconSize} />
          </AppButton>
        </div>
        <div className="sections">
          <AppButton
            label="txs"
            className={selected === ROUTE.TRANSACTIONS ? 'ma-border-1-0' : ''}
            onClick={() => handleSelection(ROUTE.TRANSACTIONS)}
          >
            <BsListOl size={iconSize} />
          </AppButton>
          <AppButton
            label="accounts"
            className={selected === ROUTE.ACCOUNTS ? 'ma-border-1-0' : ''}
            onClick={() => handleSelection(ROUTE.ACCOUNTS)}
          >
            <BsBank size={iconSize} />
          </AppButton>
          <AppButton
            label="spending"
            className={selected === ROUTE.SPENDING ? 'ma-border-1-0' : ''}
            onClick={() => handleSelection(ROUTE.SPENDING)}
          >
            <HiOutlinePresentationChartLine size={iconSize} />
          </AppButton>
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;
