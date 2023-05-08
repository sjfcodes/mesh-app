import { distanceInWords, parse } from 'date-fns';
import {
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkStableEvent,
  PlaidLinkOnEventMetadata,
  PlaidLinkError,
} from 'react-plaid-link';

/**
 * @desc small helper for pluralizing words for display given a string of items
 */
export function pluralize(noun: string, count: number) {
  return count === 1 ? noun : `${noun}s`;
}

/**
 * @desc converts string values into $ currency strings
 */
export function currencyFilter(value: number) {
  if (typeof value !== 'number') {
    return '-';
  }

  const isNegative = value < 0;
  const displayValue = value < 0 ? -value : value;
  return `${isNegative ? '' : ''}${displayValue
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')}`;
}
export function formatDate(
  timestamp: string,
  option: 'yyyy.mm.dd' | 'mm.dd.yyyy' = 'yyyy.mm.dd'
) {
  let values, yyyy, mm, dd;
  if (!timestamp) return 'na';
  const date = new Date(timestamp).toISOString().split('T')[0];
  switch (option) {
    case 'yyyy.mm.dd':
      return date;

    case 'mm.dd.yyyy':
      values = date.toString().split('-');
      yyyy = values[0];
      [mm, dd] = [values[1], values[2]].map((str) =>
        str.charAt(0) === '0' ? str.substring(1) : str
      );

      return [mm, dd, yyyy].join('.');

    default:
      return 'na';
  }
}

/**
 * @desc Prepends base64 encoded logo src for use in image tags
 */
export function formatLogoSrc(src: string | null | undefined): string {
  if (!src) return '';
  return `data:image/jpeg;base64,${src}`;
}

/**
 * @desc Checks the difference between the current time and a provided time
 */
export function diffBetweenCurrentTime(timestamp: string) {
  return distanceInWords(new Date(), parse(timestamp), {
    addSuffix: true,
    includeSeconds: true,
  }).replace(/^(about|less than)\s/i, '');
}

export const logEvent = (
  eventName: PlaidLinkStableEvent | string,
  metadata:
    | PlaidLinkOnEventMetadata
    | PlaidLinkOnSuccessMetadata
    | PlaidLinkOnExitMetadata,
  error?: PlaidLinkError | null
) => {
  console.log(`Link Event: ${eventName}`, metadata, error);
};

export const logSuccess = async ({
  institution,
  accounts,
  link_session_id,
}: PlaidLinkOnSuccessMetadata) => {
  logEvent('onSuccess', {
    institution,
    accounts,
    link_session_id,
  });
};

export const logExit = async (
  error: PlaidLinkError | null,
  { institution, status, link_session_id, request_id }: PlaidLinkOnExitMetadata
) => {
  logEvent(
    'onExit',
    {
      institution,
      status,
      link_session_id,
      request_id,
    },
    error
  );
};
