import React, { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

import { currencyFilter } from '../../util';
import { AccountType } from '../../types';
import TransactionsTable from '../TransactionTable/TransactionsTable';
import useTransactions from '../../hooks/usePlaidTransactions';

import useInstitutions from '../../hooks/usePlaidInstitutions';
import Loader from '../Loader/Loader';

import './style.scss';

interface Props {
  account: AccountType;
}

export default function AccountCard({ account }: Props) {
  const [transactionsShown, setTransactionsShown] = useState(false);
  const { getItemAccountBalances } = useInstitutions();
  const { itemAccountTransaction, getItemAccountTransactions } =
    useTransactions();
  const { id: accountId, item_id: itemId } = account;

  const toggleShowTransactions = () => {
    setTransactionsShown((shown) => !shown);
  };

  useEffect(() => {
    getItemAccountTransactions(itemId, accountId);
  }, [getItemAccountTransactions, itemAccountTransaction, itemId, accountId]);

  useEffect(() => {
    (async () => {
      // const response = await getItemAccountBalances(itemId, accountId);
      // console.log({ response });
    })();
  }, [getItemAccountBalances, itemId, accountId]);

  return (
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
        {!itemAccountTransaction[accountId]?.length ? (
          <Loader />
        ) : (
          <p>{transactionsShown ? 'hide' : 'show'}</p>
        )}
      </div>
      <div className="ma-account-footer">
        {transactionsShown && (
          <TransactionsTable transactions={itemAccountTransaction[accountId]} />
        )}
      </div>
    </div>
  );
}
