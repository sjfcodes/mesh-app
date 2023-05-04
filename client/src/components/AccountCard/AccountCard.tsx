import React, { Suspense, lazy, useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import { currencyFilter } from '../../util';
import { AccountType } from '../../types';
import useTransactions from '../../hooks/usePlaidTransactions';

import useInstitutions from '../../hooks/usePlaidInstitutions';
import Loader from '../Loader/Loader';

import './style.scss';
import SectionLoader from '../SectionLoader/SectionLoader';

const TransactionsTable = lazy(
  () => import('../TransactionTable/TransactionsTable')
);

interface Props {
  account: AccountType;
}

export default function AccountCard({ account }: Props) {
  const [transactionsShown, setTransactionsShown] = useState(false);
  const { getItemAccountBalances } = useInstitutions();
  const { loadingMap, itemAccountTransaction, getItemAccountTransactions } =
    useTransactions();
  const { id: accountId, item_id: itemId } = account;

  const toggleShowTransactions = () => {
    setTransactionsShown((shown) => !shown);
    if (!itemAccountTransaction[accountId]) {
      getItemAccountTransactions(itemId, accountId);
    }
  };

  useEffect(() => {
    (async () => {
      // const response = await getItemAccountBalances(itemId, accountId);
      // console.log({ response });
    })();
  }, [getItemAccountBalances, itemId, accountId]);

  const getButtonInstruction = () => {
    if (Array.isArray(itemAccountTransaction[accountId]))
      return <p>{transactionsShown ? 'hide' : 'show'}</p>;
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
          {transactionsShown && (
            <TransactionsTable
              transactions={itemAccountTransaction[accountId]}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}
