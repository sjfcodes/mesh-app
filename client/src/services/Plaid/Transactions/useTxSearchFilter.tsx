import { useReducer } from 'react';
import {
  DateBandState,
  DateBandStateAction,
} from './types';
import { formatDate } from '../../../util/helpers';

const now = new Date();
const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
const pastXDays = new Date(now.getTime() - thirtyDaysMs);
console.log({
  now,
  pastXDays,
});
const dateBandDefault = {
  upperBand: formatDate(now.toISOString(), 'yyyy.mm.dd'),
  lowerBand: formatDate(pastXDays.toISOString(), 'yyyy.mm.dd'),
  errorMessage: 'testing123...',
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
