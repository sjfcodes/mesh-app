import React, { Suspense, lazy, useState } from 'react';
import { AccountBase } from 'plaid';

import { currencyFilter, formatLoadingKey } from '../../util/helpers';
import { AccountType } from '../../types';
import useTransactions from '../../hooks/usePlaidTransactions';
import Loader from '../Loader/Loader';
import SectionLoader from '../SectionLoader/SectionLoader';

import './style.scss';

const TransactionsTable = lazy(() => import('../TxTable/TxTable'));

interface Props {
  account: AccountType;
  balance: AccountBase;
  useSelectedAccount?: [string, React.Dispatch<React.SetStateAction<string>>];
}

const defaultBalance = {
  subtype: 'na',
  balances: {},
};

export default function AccountCard({
  account,
  balance = defaultBalance as AccountBase,
  useSelectedAccount,
}: Props) {
  const { id: accountId, item_id: itemId } = account;
  const [selectedAccount, setSelectedAccount] =
    useSelectedAccount || useState('');
  const { loadingMap, itemAccountTransaction, getTxsByAccountId } =
    useTransactions();

  const toggleShowTransactions = () => {
    setSelectedAccount((current) => (current === accountId ? '' : accountId));

    if (!itemAccountTransaction[accountId]) {
      getTxsByAccountId(itemId, accountId);
    }
  };

  return (
    <Suspense fallback={<SectionLoader />}>
      <div className="ma-account-card">
        <div
          className={`ma-account-header ${
            selectedAccount !== accountId ? 'ma-account-not-focused' : ''
          }`}
          onClick={toggleShowTransactions}
        >
          <div className="ma-account-details">
            <div className="ma-box-name">{balance.subtype}</div>
            <div className="ma-box-name">{account.name}</div>
          </div>

          {loadingMap[formatLoadingKey(itemId, accountId)] ? (
            <Loader />
          ) : (
            <div className="ma-box-value">
              <p>$</p>
              <p>
                {balance.balances.available
                  ? currencyFilter(balance.balances.available)
                  : '...'}
              </p>
            </div>
          )}
        </div>
        {selectedAccount === accountId && (
          <TransactionsTable transactions={itemAccountTransaction[accountId]} />
        )}
      </div>
    </Suspense>
  );
}
