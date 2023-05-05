import { InstitutionsAction, InstitutionsById } from './types';

export const GET_INSTITUTION = 'GET_INSTITUTION';

/**
 * @desc Handles updates to the Institutions state as dictated by dispatched actions.
 */
function plaidInstitutionsReducer(
  state: InstitutionsById,
  action: InstitutionsAction
) {
  switch (action.type) {
    case GET_INSTITUTION:
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
