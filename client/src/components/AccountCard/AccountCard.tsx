import React, { Suspense, lazy, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import { currencyFilter } from '../../util/helpers';
import { AccountType } from '../../types';
import useTransactions from '../../hooks/usePlaidTransactions';
import Loader from '../Loader/Loader';

import './style.scss';
import SectionLoader from '../SectionLoader/SectionLoader';

const TransactionsTable = lazy(
  () => import('../TransactionTable/TransactionsTable')
);

interface Props {
  account: AccountType;
  useSelectedAccount?: [string, React.Dispatch<React.SetStateAction<string>>];
}

export default function AccountCard({ account, useSelectedAccount }: Props) {
  const [selectedAccount, setSelectedAccount] =
    useSelectedAccount || useState('');
  const { loadingMap, itemAccountTransaction, getItemAccountTransactions } =
    useTransactions();
  const { id: accountId, item_id: itemId } = account;

  const toggleShowTransactions = () => {
    setSelectedAccount((current) => (current === accountId ? '' : accountId));

    if (!itemAccountTransaction[accountId]) {
      getItemAccountTransactions(itemId, accountId);
    }
  };

  const getButtonInstruction = () => {
    if (Array.isArray(itemAccountTransaction[accountId]))
      return <p>{selectedAccount ? 'hide' : 'show'}</p>;
    else return <p>load</p>;
  };

  return (
    <Suspense fallback={<SectionLoader />}>
      <div className="ma-account-card">
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
          {loadingMap[accountId] ? <Loader /> : getButtonInstruction()}
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
