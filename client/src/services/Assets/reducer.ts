import { AssetsAction, AssetsState } from './types';

/**
 * @desc Handles updates to the propertiesByUser as dictated by dispatched actions.
 */
function assetsReducer(state: AssetsState, action: AssetsAction | any) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      return {
        assets: action.payload,
      };
    case 'FAILED_GET':
      return {
        ...state,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
}

export default assetsReducer;
