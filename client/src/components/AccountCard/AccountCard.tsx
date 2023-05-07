import React, { Suspense, lazy, useState } from 'react';
import { AccountBase } from 'plaid';

import { currencyFilter } from '../../util/helpers';
import { AccountType } from '../../types';
import useTransactions from '../../hooks/usePlaidTransactions';
import Loader from '../Loader/Loader';
import SectionLoader from '../SectionLoader/SectionLoader';

import './style.scss';

const TransactionsTable = lazy(
  () => import('../TransactionTable/TransactionsTable')
);

interface Props {
  account: AccountType;
  balance: AccountBase;
  useSelectedAccount?: [string, React.Dispatch<React.SetStateAction<string>>];
}

export default function AccountCard({
  account,
  balance,
  useSelectedAccount,
}: Props) {
  const { id: accountId, item_id: itemId } = account;
  const [selectedAccount, setSelectedAccount] =
    useSelectedAccount || useState('');
  const { loadingMap, itemAccountTransaction, getAccountTransactions } =
    useTransactions();

  const toggleShowTransactions = () => {
    setSelectedAccount((current) => (current === accountId ? '' : accountId));

    if (!itemAccountTransaction[accountId]) {
      getAccountTransactions(itemId, accountId);
    }
  };

  return (
    <Suspense fallback={<SectionLoader />}>
      <div className="ma-account-card">
        <div className="ma-account-header" onClick={toggleShowTransactions}>
          <div className="ma-account-details">
            {/* <p className="ma-account-subtype">{balance.subtype}</p>
            <p>[{account.name}]</p>
            <p className="ma-account-balance">
              {currencyFilter(balance.balances.available || 0)}
            </p> */}
            <div className="ma-box-name">{balance.subtype}</div>
            <div className="ma-box-name">{account.name}</div>
          </div>

          {loadingMap[accountId] ? (
            <Loader />
          ) : (
            <div className="ma-box-value">
              <p>$</p>
              <p>{currencyFilter(balance.balances.available || 0)}</p>
            </div>
          )}
        </div>
        <div className="ma-account-footer">
          {selectedAccount === accountId && (
            <TransactionsTable
              transactions={itemAccountTransaction[accountId]}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}
