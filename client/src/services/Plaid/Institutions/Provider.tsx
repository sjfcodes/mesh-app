import React, {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from 'react';

import {
  getInstitutionsById as apiGetInstitutionById,
  getInstitutionAccountBalances as apiGetItemAccountBalances,
} from '../../../util/api';
import plaidInstitutionsReducer, { GET_INSTITUTION } from './reducer';
import { InstitutionsContextShape } from './types';

const initialState = {};

export const InstitutionsContext = createContext<InstitutionsContextShape>(
  initialState as InstitutionsContextShape
);

/**
 * @desc Maintains the Institutions context state and provides functions to update that state.
 */
export const InstitutionsProvider = (props: any) => {
  const [accountBalances, setAccountBalances] = useState({});
  const [institutionsById, dispatch] = useReducer(
    plaidInstitutionsReducer,
    initialState
  );

  /**
   * @desc Requests details for a single Institution.
   */
  const getInstitutionsById = useCallback(async (id: string) => {
    const {
      data: { data },
    } = await apiGetInstitutionById(id);
    dispatch({ type: GET_INSTITUTION, payload: data[0] });
  }, []);

  const getInstitutionAccountBalances = useCallback(
    async (itemId: string, accountId: string) => {
      const {
        data: { data },
      } = await apiGetItemAccountBalances(itemId, accountId);
      setAccountBalances(data);
    },
    []
  );

  /**
   * @desc Builds a more accessible state shape from the Institution data. useMemo will prevent
   * these from being rebuilt on every render unless institutionsById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      accountBalances,
      institutionsById,
      getInstitutionsById,
      getInstitutionAccountBalances,
    };
  }, [
    accountBalances,
    institutionsById,
    getInstitutionsById,
    getInstitutionAccountBalances,
  ]);

  return <InstitutionsContext.Provider value={value} {...props} />;
};
