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

      return {
        ...state,
        ...action.payload,
      };

    default:
      console.warn('unknown action');
      return state;
  }
};

export default plaidItemsReducer;
