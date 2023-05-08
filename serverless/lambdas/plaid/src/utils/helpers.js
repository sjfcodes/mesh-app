/**
 * Split long list into smaller lists of specified length
 *
 * @param {Object[]} list
 * @param {number} maxLength
 * @returns
 */
export const splitListIntoSmallerLists = (list, maxLength) => {
  [list, maxLength].forEach((arg) => {
    if (!arg) throw new Error(`missing ${arg}`);
  });

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
