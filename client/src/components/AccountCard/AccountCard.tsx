import React, { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import { currencyFilter } from '../../util';
import { AccountType } from '../../types';
import TransactionsTable from '../TransactionTable/TransactionsTable';
import useTransactions from '../../hooks/usePlaidTransactions';

import './style.scss';

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
    <div key={account.id} className="ma-account-card">
      <div className="ma-account-header" onClick={toggleShowTransactions}>
        <div className="ma-account-details">
          <h3>[{account.name}]</h3>
          <p className="ma-account-subtype">
            {startCase(toLower(account.subtype))}
          </p>
          <p className="ma-account-balance">
            {currencyFilter(account.current_balance)}
          </p>
        </div>
        <p>{transactionsShown ? 'HIDE' : 'SHOW'}</p>
      </div>
      <div className="ma-account-footer">
        {transactionsShown && (
          <TransactionsTable transactions={accountTransactions[accountId]} />
        )}
      </div>
    </div>
  );
}
