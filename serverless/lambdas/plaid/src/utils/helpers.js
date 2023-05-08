/**
 * Split long list into smaller lists of specified length
 *
 * @param {Object[]} list
 * @param {number} maxLength
 * @returns
 */
export const splitListIntoSmallerLists = (list, maxLength) => {
  guard({ list, maxLength })

  let requestQueue = [[]];
  let pointer = 0;

  if (list.length === 0) {
    return requestQueue;
  }

  while (list.length) {
    const nextRequest = list.pop();

    if (requestQueue[pointer].length === maxLength) {
      requestQueue.push([nextRequest]);
      pointer++;
    } else {
      requestQueue[pointer].push(nextRequest);
    }
  }

  return requestQueue;
};

export const guard = (object) => {
  if (Array.isArray(object) || typeof object !== 'object') {
    throw new Error('guard arg must be object');
  }

  const errors = [];

  Object.entries(object).forEach(([key, value]) => {
    if (!value) errors.push(`missing ${key}`);
  });

  if (errors.length) throw new Error(errors.join('! ') + '!');
};
