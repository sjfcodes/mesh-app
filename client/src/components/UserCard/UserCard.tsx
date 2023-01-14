import React, { useEffect, useState } from 'react';
import usePlaidItems from '../../hooks/usePlaidItems';

import useUser from '../../hooks/useUser';
import { pluralize } from '../../util';
import AppLogo from '../AppLogo/AppLogo';

import './styles.scss';

export default function UserCard() {
  const { user } = useUser();
  const { plaidItem, allAccounts } = usePlaidItems();
  const [connections, setConnections] = useState('');

  useEffect(() => {
    const itemCount = Object.keys(plaidItem).length;
    const itemKey = pluralize('item', itemCount);
    const accountCount = allAccounts.length;
    const accountKey = pluralize('account', accountCount);

    setConnections(
      `{ ${itemKey}: ${itemCount}, ${accountKey}: ${accountCount} }`
    );
  }, [plaidItem, allAccounts]);

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
          <p>{connections}</p>
        </li>
      </ul>
    </div>
  );
}
