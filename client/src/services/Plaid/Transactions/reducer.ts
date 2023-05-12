import { TransactionsAction, TransactionsState } from './types';

/**
 * @desc Handles updates to the Transactions state as dictated by dispatched actions.
 */
const transactionsReducer = (
  state: TransactionsState,
  action: TransactionsAction | any
) => {
  if (action.type === 'SUCCESSFUL_GET') {
    const {
      payload: { transactions, accountId },
    } = action;

    return {
      ...state,
      [accountId]: transactions,
    };
  } else {
    console.warn('unknown action: ', action.type, action.payload);
    return state;
  }
};

export default transactionsReducer;
