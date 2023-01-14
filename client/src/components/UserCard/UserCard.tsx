import React, { useEffect, useState } from 'react';
import usePlaidItems from '../../hooks/usePlaidItems';

import useUser from '../../hooks/useUser';
import AppLogo from '../AppLogo/AppLogo';

import './styles.scss';

export default function UserCard() {
  const { user } = useUser();
  const { plaidItem, allAccounts } = usePlaidItems();
  const [itemCount, setItemCount] = useState({
    items: 0,
    accounts: allAccounts.length,
  });

  useEffect(() => {
    setItemCount({
      items: Object.keys(plaidItem).length,
      accounts: allAccounts.length,
    });
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
          <p>
            {JSON.stringify(itemCount)
              .replaceAll('"', ' ')
              .replaceAll(':', ': ')}
          </p>
        </li>
      </ul>
    </div>
  );
}
