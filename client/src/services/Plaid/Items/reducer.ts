import omit from 'lodash/omit';
// import omitBy from 'lodash/omitBy';
// import keyBy from 'lodash/keyBy';

import { ItemsAction, ItemsState } from './types';

/**
 * @desc Handles updates to the Items state as dictated by dispatched actions.
 */
const plaidItemsReducer = (state: ItemsState, action: ItemsAction) => {
  switch (action.type) {
    case 'SUCCESSFUL_ITEM_GET':
      if (!Object.keys(action.payload).length) {
        return state;
      }

      return { ...state, ...action.payload };

    case 'SUCCESSFUL_ITEM_SYNC':
      if (!action.payload.tx_cursor_updated_at) {
        return state;
      }

      alert("tx's sync'd to database. Reload page to get new transactions.");
      return state;

    case 'SUCCESSFUL_DELETE_ITEM':
      return omit(state, [action.payload]);

    case 'SUCCESSFUL_ACCOUNT_DELETE':
      return state;
    // return omitBy(
    //   state,
    //   (transaction) => transaction.item_id === action.payload
    // );

    default:
      console.warn('unknown action');
      return state;
  }
};

export default plaidItemsReducer;
