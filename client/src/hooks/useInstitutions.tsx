import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import { Institution } from 'plaid/dist/api';
import useApi from './useApi';

interface InstitutionsById {
  [key: string]: Institution;
}
interface InstitutionsState {
  institutionsById: InstitutionsById;
}

const initialState = {};
type InstitutionsAction = {
  type: 'SUCCESSFUL_GET';
  payload: Institution;
};

interface InstitutionsContextShape extends InstitutionsState {
  dispatch: Dispatch<InstitutionsAction>;
  getItemInstitution: (id: string) => void;
  formatLogoSrc: (src: string | null | undefined) => string;
}
const InstitutionsContext = createContext<InstitutionsContextShape>(
  initialState as InstitutionsContextShape
);

/**
 * @desc Maintains the Institutions context state and provides functions to update that state.
 */
export function InstitutionsProvider(props: any) {
  const { getItemInstitution: apiGetInstitutionById } = useApi();
  const [institutionsById, dispatch] = useReducer(reducer, initialState);

  /**
   * @desc Requests details for a single Institution.
   */
  const getItemInstitution = useCallback(async (id: string) => {
    const {
      data: { body: institutions },
    } = await apiGetInstitutionById(id);
    dispatch({ type: 'SUCCESSFUL_GET', payload: institutions[0] });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Institution data. useMemo will prevent
   * these from being rebuilt on every render unless institutionsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allInstitutions = Object.values(institutionsById);
    return {
      allInstitutions,
      institutionsById,
      getItemInstitution,
      getInstitutionsById: getItemInstitution,
      formatLogoSrc,
    };
  }, [institutionsById, getItemInstitution]);

  return <InstitutionsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Institutions state as dictated by dispatched actions.
 */
function reducer(state: InstitutionsById, action: InstitutionsAction) {
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

/**
 * @desc A convenience hook to provide access to the Institutions context state in components.
 */
export default function useInstitutions() {
  const context = useContext(InstitutionsContext);

  if (!context) {
    throw new Error(
      `useInstitutions must be used within an InstitutionsProvider`
    );
  }

  return context;
}

/**
 * @desc Prepends base64 encoded logo src for use in image tags
 */
function formatLogoSrc(src: string) {
  return src && `data:image/jpeg;base64,${src}`;
}
