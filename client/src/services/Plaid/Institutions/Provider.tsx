import React, { createContext, useCallback, useMemo, useReducer } from 'react';

import {
  getItemInstitution as apiGetInstitutionById,
  getItemAccountBalances as apiGetItemAccountBalances,
} from '../../../util/api';
import plaidInstitutionsReducer from './reducer';
import { InstitutionsContextShape } from './types';

const initialState = {};

/**
 * @desc Prepends base64 encoded logo src for use in image tags
 */
function formatLogoSrc(src: string) {
  return src && `data:image/jpeg;base64,${src}`;
}

export const InstitutionsContext = createContext<InstitutionsContextShape>(
  initialState as InstitutionsContextShape
);

/**
 * @desc Maintains the Institutions context state and provides functions to update that state.
 */
export const InstitutionsProvider = (props: any) => {
  const [institutionsById, dispatch] = useReducer(
    plaidInstitutionsReducer,
    initialState
  );

  /**
   * @desc Requests details for a single Institution.
   */
  const getItemInstitution = useCallback(async (id: string) => {
    const {
      data: { body: institutions },
    } = await apiGetInstitutionById(id);
    dispatch({ type: 'SUCCESSFUL_GET', payload: institutions[0] });
  }, []);

  const getItemAccountBalances = useCallback(
    async (itemId: string, accountId: string) => {
      const data = apiGetItemAccountBalances(itemId, accountId);
      console.log(data);
    },
    []
  );

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
      getItemAccountBalances,
      formatLogoSrc,
    };
  }, [institutionsById, getItemInstitution, getItemAccountBalances]);

  return <InstitutionsContext.Provider value={value} {...props} />;
};
