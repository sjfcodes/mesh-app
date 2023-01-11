/**
 * Split long list into smaller lists of specified length
 *
 * @param {transaction[]} list
 * @param {number} maxLength
 * @returns
 */
export const splitListIntoSmallerLists = (list, maxLength) => {
    if (!list || !maxLength) throw new Error('missing required arguments!');
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