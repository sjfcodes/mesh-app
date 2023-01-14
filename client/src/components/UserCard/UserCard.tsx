import React, { useState } from 'react';

import useUser from '../../hooks/useUser';
import { pluralize } from '../../util';
import AppLogo from '../AppLogo/AppLogo';

import './styles.scss';

export default function UserCard() {
  const { user } = useUser();
  const [numOfItems] = useState(0);

  return (
    <div className="ma-user-card">
      <div>
        <AppLogo />
      </div>
      <ul>
        <li>
          <h3>env</h3>
          <p>{process.env.REACT_APP_PLAID_ENV}</p>
        </li>
        <li>
          <h3>user</h3>
          <p>{user.email}</p>
        </li>
        <li>
          <h3>connection</h3>
          <p>{`{ ${pluralize('item', numOfItems)}: ${numOfItems} }`}</p>
        </li>
      </ul>
    </div>
  );
}
