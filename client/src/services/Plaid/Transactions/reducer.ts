import { TransactionsAction, TransactionsState } from "./types";

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
      return {
        ...state,
        [accountId]: transactions,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
};

export default transactionsReducer;
