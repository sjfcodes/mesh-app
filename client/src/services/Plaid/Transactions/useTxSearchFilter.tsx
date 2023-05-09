import { useReducer } from 'react';
import {
  DateBandState,
  DateBandStateAction,
} from './types';
import { formatDate } from '../../../util/helpers';

const now = new Date();

const lookBackDays = 14
const lookBackDaysMs = lookBackDays * 24 * 60 * 60 * 1000;
const pastXDays = new Date(now.getTime() - lookBackDaysMs);
const dateBandDefault = {
  upperBand: formatDate(now.toISOString(), 'yyyy.mm.dd'),
  lowerBand: formatDate(pastXDays.toISOString(), 'yyyy.mm.dd'),
  errorMessage: '',
};

const useTxSearchFilter = () => {
  const useTxSearchFilter = useReducer(
    (state: DateBandState, action: DateBandStateAction) => {
      return { ...state, ...action };
    },
    dateBandDefault
  );

  return useTxSearchFilter;
};

export default useTxSearchFilter;
