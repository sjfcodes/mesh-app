import { InstitutionsAction, InstitutionsById } from './types';

/**
 * @desc Handles updates to the Institutions state as dictated by dispatched actions.
 */
function plaidInstitutionsReducer(
  state: InstitutionsById,
  action: InstitutionsAction
) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload) {
        return state;
      }

      return {
        ...state,
        [action.payload.institution_id]: action.payload,
      };
    default:
      console.warn('unknown action');
      return state;
  }
}

export default plaidInstitutionsReducer;
