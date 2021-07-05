import { string } from './sortTypes'

/**
 * Creates a sample row compatible with sortTypes
 * @param {any} value
 * @param {string} columnId
 * @returns {Object}
 */
function createSampleRow(value, columnId='target'){
  return {
    values: {
      [columnId]: value
    }
  }
};

describe('string sorting', () => {
  test.each([
    ['a', 'b', -1],
    ['b', 'c', -1],
    ['z', 'a', 1],
    ['@', '@', 0]
  ])('should sort string values', (a, b, expected) => {
    expect(
      string(
        createSampleRow(a),
        createSampleRow(b),
        'target'
      )
    ).toBe(expected)
  })
  test.each([
    [1, 1, 0],
    [1,2, -1],
    [2,1, 1],
    [true, true, 0],
    [new Date('2021-01-01T00:00:00Z'), new Date('2021-01-01T00:00:01Z'), -1],
    [{}, {}, 0],
    [undefined, undefined, 0],
    [null, null, 0],
    [1, null, 1],
    [null, 1, -1],
    [null, undefined, 0]
  ])('should handle invalid string values', (a, b, expected) => {
    expect(
      string(
        createSampleRow(a),
        createSampleRow(b),
        'target'
      )
    ).toBe(expected)
  })
})
