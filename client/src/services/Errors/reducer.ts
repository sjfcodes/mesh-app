import { ErrorsAction, ErrorsState } from './types';

/**
 * @desc Handles updates to the Errors state as dictated by dispatched actions.
 */
const errorsReducer = (state: ErrorsState, action: ErrorsAction) => {
  switch (action.type) {
    case 'SET_ERROR':
      if (action.payload == null) {
        return state;
      }
      return {
        code: action.payload.code,
        message: action.payload.message,
      };
    case 'RESET_ERROR':
      return {};

    default:
      console.warn('unknown action');
      return state;
  }
};

export default errorsReducer;
