import { TransactionType } from '../../../types';
import { TransactionsAction, TransactionsState } from './types';

/**
 * @desc Handles updates to the Transactions state as dictated by dispatched actions.
 */
const transactionsReducer = (
  state: TransactionsState,
  action: TransactionsAction | any
) => {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      const {
        payload: { transactions, accountId },
      } = action;
      if (!transactions.length) {
        return state;
      }
      const sorted = transactions.sort(
        (
          { transaction: txA }: TransactionType,
          { transaction: txB }: TransactionType
        ) => new Date(txB?.date).getTime() - new Date(txA?.date).getTime()
      );
      return {
        ...state,
        [accountId]: sorted,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
};

export default transactionsReducer;
