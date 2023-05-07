import { useEffect, useMemo } from 'react';
import { PlaidTransactionType, TransactionType } from '../types';
import useTransactions from './usePlaidTransactions';
import usePlaidItems from './usePlaidItems';
import { currencyFilter } from '../util/helpers';

const useFormattedTransactions = () => {
  const { allAccounts } = usePlaidItems();
  const { allTransactions, loadingMap, getTransactionsByAccountId } =
    useTransactions();

  useEffect(() => {
    const hasLoaded = Object.keys(loadingMap);
    const needsLoading = allAccounts.filter(
      ({ id }) => !hasLoaded.includes(id)
    );

    needsLoading.forEach(({ item_id: itemId, id: accountId }) => {
      return getTransactionsByAccountId(itemId, accountId);
    });
  }, [allAccounts]);

  const formattedTxs: TransactionType[] = useMemo(() => {
    if (!allTransactions.length) return [];

    const processed = [] as TransactionType[];

    const processTx = (txData: TransactionType) => {
      const { transaction: tx } = txData;
      if (!tx.category || !Array.isArray(tx.category)) tx.category = ['~'];
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

  return { formattedTxs };
};

export default useFormattedTransactions;
