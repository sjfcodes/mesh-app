import { useCallback } from 'react';

import { getTransactionsByAccountId as apiGetItemAccountTransactions } from '../../../util/api';
import { ItemId } from '../Items/types';
import { AccountId } from '../Institutions/types';
import { TransactionType } from '../../../types';

type Props = {
  dateBand: any;
  dispatch: any;
  hasRequested: any;
  setLoadingMap: any;
};

const useGetTxsByAccountId = ({
  dateBand,
  dispatch,
  hasRequested,
  setLoadingMap,
}: Props) => {

  /**
   * Requests transactions within current filter ranges for an account.
   * Skip request if data has already fetched.
   * Use 'refresh' parameter to force a new request.
   */
  const getTxsByAccountId = useCallback(
    async (itemId: ItemId, accountId: AccountId, refresh?: boolean) => {
      setLoadingMap({ itemId, accountId, loading: true });

      if (!hasRequested.current.byAccount[accountId] || refresh) {
        hasRequested.current.byAccount[accountId] = true;
        const {
          data: {
            data: { transactions },
          },
        } = await apiGetItemAccountTransactions(
          itemId,
          accountId,
          dateBand.lowerBand,
          dateBand.upperBand
        );

        const sorted = transactions.sort(
          (
            { transaction: txA }: TransactionType,
            { transaction: txB }: TransactionType
          ) => new Date(txB?.date).getTime() - new Date(txA?.date).getTime()
        );

        dispatch({
          type: 'SUCCESSFUL_GET',
          payload: { accountId, transactions: sorted },
        });
      }
      setLoadingMap({ itemId, accountId, loading: false });
    },
    [dateBand]
  );
  return {getTxsByAccountId};
};

export default useGetTxsByAccountId;
