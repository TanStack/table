import { describe, expect, it } from 'vitest'
import { getAriaSort } from '../../../../src'

describe('getAriaSort', () => {
  it('maps an ascending sort to "ascending"', () => {
    expect(getAriaSort('asc')).toBe('ascending')
  })

  it('maps a descending sort to "descending"', () => {
    expect(getAriaSort('desc')).toBe('descending')
  })

  it('maps the unsorted state (false) to "none"', () => {
    expect(getAriaSort(false)).toBe('none')
  })
})
