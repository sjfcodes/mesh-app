import { useMemo, useReducer } from 'react';
import { DateBand } from '../services/Plaid/Transactions/types';

export type DateBandState = {
  lowerBand: DateBand;
  upperBand: DateBand;
  errorMessage: string;
};
export type DateBandStateAction = {
  lowerBand?: DateBand;
  upperBand?: DateBand;
};

const dateBandDefault = {
  upperBand: '',
  lowerBand: '2023-04-01',
  errorMessage: 'testing123...',
};

const useTxSearchFilter = () => {
  const [dateBand, setDateBand] = useReducer(
    (state: DateBandState, action: DateBandStateAction) => {
      return { ...state, ...action };
    },
    dateBandDefault
  );

  return useMemo(
    () => ({
      dateBand,
      setDateBand,
    }),
    [dateBand, setDateBand]
  );
};

export default useTxSearchFilter;
