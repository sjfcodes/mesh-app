import { formatLoadingKey } from '../../../util/helpers';
import { LoadingMapAction, LoadingMapState, TransactionsAction, TransactionsState } from './types';

export const transactionsReducer = (
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

export const loadingMapReducer = (
  state: LoadingMapState,
  action: LoadingMapAction
) => {
  const key = formatLoadingKey(action.itemId, action.accountId);
  return { ...state, [key]: action.loading };
};
