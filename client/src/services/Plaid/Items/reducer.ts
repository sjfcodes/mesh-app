import omit from 'lodash/omit';
// import omitBy from 'lodash/omitBy';
import keyBy from 'lodash/keyBy';

import { ItemsAction, ItemsState } from './types';

/**
 * @desc Handles updates to the Items state as dictated by dispatched actions.
 */
const plaidItemsReducer = (state: ItemsState, action: ItemsAction) => {
  switch (action.type) {
    case 'SUCCESSFUL_REQUEST_ITEM':
      if (!Object.keys(action.payload).length) {
        return state;
      }

      return { ...state, ...action.payload };
    case 'SUCCESSFUL_DELETE_ITEM':
      return omit(state, [action.payload]);

    case 'SUCCESSFUL_DELETE_ACCOUNT':
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
