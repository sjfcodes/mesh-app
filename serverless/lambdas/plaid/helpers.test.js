import { splitListIntoSmallerLists } from './utils/helpers.js';

describe('splitListIntoSmallerLists()', () => {
  it('should throw error when list not provided', () => {
    const maxLength = 25;
    const result = () => splitListIntoSmallerLists(null, maxLength);
    expect(result).toThrow('missing required arguments!');
  });

  it('should throw error when maxLength not provided', () => {
    const list = Array.from(Array(100).keys());
    const result = () => splitListIntoSmallerLists(list, null);
    expect(result).toThrow('missing required arguments!');
  });

  it('should split an array of 100 into arrays of 25', () => {
    const list = Array.from(Array(100).keys());
    const maxLength = 25;
    const result = splitListIntoSmallerLists(list, maxLength);

    expect(result.length).toBe(4);
    expect(result[0].length).toBe(maxLength);
    expect(result[0][0]).toBe(99);

    expect(result[1].length).toBe(maxLength);
    expect(result[1][0]).toBe(74);

    expect(result[2].length).toBe(maxLength);
    expect(result[2][0]).toBe(49);

    expect(result[3].length).toBe(maxLength);
    expect(result[3][0]).toBe(24);
  });
});
