import React, { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import { currencyFilter } from '../util';
import { AccountType } from '../types';
import TransactionsTable from './TransactionsTable';
import useTransactions from '../hooks/useTransactions';

interface Props {
  account: AccountType;
}

export default function AccountCard({ account }: Props) {
  const [transactionsShown, setTransactionsShown] = useState(false);

  const { accountTransactions, getItemAccountTransactions } = useTransactions();
  const { id: accountId, item_id: itemId } = account;

  const toggleShowTransactions = () => {
    setTransactionsShown((shown) => !shown);
  };

  useEffect(() => {
    getItemAccountTransactions(itemId, accountId);
  }, [getItemAccountTransactions, accountTransactions, itemId, accountId]);

  return (
    <div>
      <div onClick={toggleShowTransactions}>
        <div className="account-data-row">
          <div className="account-data-row__left">
            <div className="account-data-row__name">{account.name}</div>
            <div className="account-data-row__balance">{`${startCase(
              toLower(account.subtype)
            )} • Balance ${currencyFilter(account.current_balance)}`}</div>
          </div>
          <div className="account-data-row__right">
            <p>{transactionsShown ? 'HIDE' : 'SHOW'}</p>
          </div>
        </div>
      </div>
      {transactionsShown && <TransactionsTable transactions={accountTransactions[accountId]} />}
    </div>
  );
}
