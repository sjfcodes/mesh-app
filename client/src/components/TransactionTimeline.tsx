import { useEffect } from 'react';
import usePlaidItems from '../hooks/usePlaidItems';
import useTransactions from '../hooks/usePlaidTransactions';

import TransactionsTable from './TransactionTable/TransactionsTable';
import Loader from './Loader/Loader';
import useFormattedTransactions from '../hooks/useFormattedTransactions';

export default function TransactionTimeline() {
  const { allAccounts, isLoading: accountsLoading } = usePlaidItems();
  const { loadingMap, getItemAccountTransactions } = useTransactions();
  const { formattedTxs } = useFormattedTransactions();

  useEffect(() => {
    const hasLoaded = Object.keys(loadingMap);
    const needsLoading = allAccounts.filter(
      ({ id }) => !hasLoaded.includes(id)
    );

    needsLoading.map(({ item_id: itemId, id: accountId }) => {
      console.log('loading', accountId);
      return getItemAccountTransactions(itemId, accountId);
    });
  }, []);

  if (accountsLoading) {
    return <Loader />;
  }

  return (
    <main>
      {formattedTxs.length ? (
        <TransactionsTable transactions={formattedTxs} fullHeight />
      ) : (
        'no txs loaded yet'
      )}
    </main>
  );
}
