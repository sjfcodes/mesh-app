import { useMemo } from 'react';
import usePlaidItems from '../hooks/usePlaidItems';
import useTransactions from '../hooks/usePlaidTransactions';
import { PlaidTransactionType, TransactionType } from '../types';

import { currencyFilter } from '../util';
import TransactionsTable from './TransactionTable/TransactionsTable';

export default function TransactionTimeline() {
  const { allTransactions } = useTransactions();
  const { allAccounts } = usePlaidItems();

  const formattedTxs: TransactionType[] = useMemo(() => {
    if (!allTransactions.length) return [];
    const processed = [] as TransactionType[];

    const processTx = (txData: TransactionType) => {
      const { transaction: tx } = txData;
      if (tx?.name?.includes('Online Banking Transfer')) {
        if (tx.name.includes('To')) {
          /**
           * if tx name contains "To" as in transfer "To xxxxxxxx<mask>"
           * search for account with matching 4 digit mask
           * if account is found, overwrite name with formatted name.
           *
           * if tx name contains "from" as in transfer "from xxxxxxxx<mask>"
           * search for account with matching 4 digit mask
           * if account is found, return null as tx was formatted and logged already
           */
          const source = allAccounts.filter(
            (account) => account.id === tx.account_id
          )[0];

          const mask = tx.name
            .split(' ')
            .filter((str) => {
              const last4Chars = str.slice(-4);
              return !isNaN(parseInt(last4Chars));
            })[0]
            .slice(-4);

          const target = allAccounts.filter((account) => {
            return account.mask === mask;
          })[0];
          if (target) {
            const sourceLabel = `[${source.subtype}-${source.mask}]`;
            const targetLabel = `[${target.subtype}-${target.mask}]`;
            tx.name = `Transfer ${currencyFilter(
              Math.abs(tx.amount)
            )} from ${sourceLabel} to ${targetLabel}`;
            tx.amount = 0;
          }
        } else if (tx.name?.includes('from')) {
          const mask = tx.name.split(' ')[4].slice(-4);
          const source = allAccounts.filter(
            (account) => account.mask === mask
          )[0];

          if (source) {
            return null;
          }
        }
      }
      processed.push({
        ...txData,
        transaction: tx as PlaidTransactionType,
      });
    };

    allTransactions.forEach(processTx);
    return processed;
  }, [allAccounts, allTransactions]);

  return (
    <main>
      {formattedTxs.length ? (
        <TransactionsTable transactions={formattedTxs} fullHeight />
      ) : (
        ''
      )}
    </main>
  );
}
