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

const months = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * @desc Returns formatted date.
 */
export function formatDate(timestamp: string) {
  if (timestamp) {
    // slice will return the first 10 char(date)of timestamp
    // coming in as: 2019-05-07T15:41:30.520Z
    const [y, m, d] = timestamp.slice(0, 10).split('-');
    return `${months[+m]} ${d}, ${y}`;
  }

  return '';
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
