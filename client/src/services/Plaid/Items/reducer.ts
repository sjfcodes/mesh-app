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

    case 'SUCCESSFUL_ITEM_SYNC':
      if (!action.payload.tx_cursor_updated_at || !action.payload.item_id) {
        return state;
      }
      return {
        ...state,
        [action.payload.item_id]: {
          ...state[action.payload.item_id],
          tx_cursor_updated_at: action.payload.tx_cursor_updated_at,
        },
      };

    default:
      console.warn('unknown action');
      return state;
  }
};

export default plaidItemsReducer;
