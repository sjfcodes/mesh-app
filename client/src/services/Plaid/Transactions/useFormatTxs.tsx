import { useEffect, useMemo } from 'react';
import {
  PlaidTransactionType,
  TransactionType,
} from '../../../types';
import { currencyFilter, formatLoadingKey } from '../../../util/helpers';
import { ItemAccountId } from '../Items/types';
import {
  GetTransactionsByAccountId,
  LoadingMapState,
  TransactionsState,
} from './types';
import usePlaidItems from '../../../hooks/usePlaidItems';

type Props = {
  itemAccountTransaction: TransactionsState;
  loadingMap: LoadingMapState;
  getTxsByAccountId: GetTransactionsByAccountId;
};

const useFormatTxs = ({
  itemAccountTransaction,
  loadingMap,
  getTxsByAccountId,
}: Props) => {
  const { allAccounts } = usePlaidItems();
  const removePhrases = ['MEMO=', 'Withdrawal -', 'Deposit -'];

  const formatTransactions = (tx: TransactionType) => {
    const copy = { ...tx };
    removePhrases.forEach((phrase) => {
      if (copy.transaction.name?.includes(phrase)) {
        copy.transaction.name = copy.transaction.name.split(phrase)[1].trim();
      }
    });

    return copy;
  };

  const allTransactions = Object.values(itemAccountTransaction)
    .reduce((prev, curr) => {
      const formatted = curr.map(formatTransactions);
      return [...prev, ...formatted];
    }, [])
    .sort(
      (
        { transaction: txA }: TransactionType,
        { transaction: txB }: TransactionType
      ) => new Date(txB?.date).getTime() - new Date(txA?.date).getTime()
    );

  /**
   * determine which accounts may have already loaded
   * get transactions for remaining accounts
   */
  useEffect(() => {
    const hasLoaded: ItemAccountId[] = Object.keys(loadingMap);
    const needsLoading = allAccounts.filter(
      ({ item_id, id }) => !hasLoaded.includes(formatLoadingKey(item_id, id))
    );

    needsLoading.forEach(({ item_id: itemId, id: accountId }) =>
      getTxsByAccountId(itemId, accountId)
    );
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

export default useFormatTxs;
