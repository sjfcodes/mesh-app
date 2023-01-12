import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';

import { ItemsAction, ItemsState } from './types';

/**
 * @desc Handles updates to the Items state as dictated by dispatched actions.
 */
const plaidItemsReducer = (state: ItemsState, action: ItemsAction) => {
  switch (action.type) {
    case 'SUCCESSFUL_REQUEST':
      if (!Object.keys(action.payload).length) {
        return state;
      }

      return { ...state, ...action.payload };
    case 'SUCCESSFUL_DELETE':
      return omit(state, [action.payload]);
    case 'DELETE_BY_USER':
      return omitBy(state, (plaidItem) => plaidItem.user_id === action.payload);
    default:
      console.warn('unknown action');
      return state;
  }
};

export default plaidItemsReducer;
