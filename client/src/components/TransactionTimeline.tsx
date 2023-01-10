import { useMemo, useReducer } from 'react';
import useAccounts from '../hooks/useAccounts';
import useTransactions from '../hooks/useTransactions';
import { TransactionType } from '../types';

import { currencyFilter } from '../util';
import TransactionsTable from './TransactionsTable';

export default function TransactionTimeline() {
  const { allTransactions } = useTransactions();
  const { allAccounts } = useAccounts();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transfers, setTransfers] = useReducer(
    (state: object, tx: TransactionType) => {
      return state;
    },
    {}
  );

  const transactions = useMemo(() => {
    const mapFn = (tx: TransactionType) => {
      if (tx.name.includes('Online Banking Transfer')) {
        if (tx.name.includes('To')) {
          /**
           * if tx name containes "To" as in transfer "To xxxxxxxx<mask>"
           * search for acount with matching 4 digit mask
           * if account is found, overwrite name with formatted name.
           *
           * if tx name contains "from" as in transfer "from xxxxxxxx<mask>"
           * search for account with mastching 4 digit mask
           * if account is found, return null as tx was formatted and logged already
           */
          const source = allAccounts.filter(
            (account) => account.id === tx.account_id
          )[0];

          const mask = tx.name.split(' ')[4].slice(-4);
          const target = allAccounts.filter(
            (account) => account.mask === mask
          )[0];

          if (target) {
            const sourceLabel = `[${source.official_name}-${source.mask}]`;
            const targetLabel = `[${target.official_name}-${target.mask}]`;

            tx.name = `Transfer ${currencyFilter(
              Math.abs(tx.amount)
            )} from ${sourceLabel} to ${targetLabel}`;
            tx.amount = 0;
          }
        } else if (tx.name.includes('from')) {
          const mask = tx.name.split(' ')[4].slice(-4);
          const source = allAccounts.filter(
            (account) => account.mask === mask
          )[0];

          if (source) {
            return null;
          }
        }
      }
      return tx;
    };
    return allTransactions
      .map(mapFn)
      .filter((tx: TransactionType | null) => tx !== null)
      .sort(
        (a: TransactionType, b: TransactionType) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [allAccounts, allTransactions]);

  return <TransactionsTable transactions={transactions} />;
}
