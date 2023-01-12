import { LinkAction } from './types';

/**
 * @desc Handles updates to the LinkTokens state as dictated by dispatched actions.
 */
const linkReducer = (state: any, action: LinkAction) => {
  switch (action.type) {
    case 'LINK_TOKEN_CREATED':
      return {
        ...state,
        byUser: {
          [action.id]: action.token,
        },
        error: {},
      };

    case 'LINK_TOKEN_UPDATE_MODE_CREATED':
      return {
        ...state,
        error: {},
        byItem: {
          ...state.byItem,
          [action.id]: action.token,
        },
      };
    case 'DELETE_USER_LINK_TOKEN':
      return {
        ...state,
        byUser: {
          [action.id]: '',
        },
      };
    case 'DELETE_ITEM_LINK_TOKEN':
      return {
        ...state,
        byItem: {
          ...state.byItem,
          [action.id]: '',
        },
      };
    case 'LINK_TOKEN_ERROR':
      return {
        ...state,
        error: action.error,
      };
    default:
      console.warn('unknown action');
      return state;
  }
};
export default linkReducer;
