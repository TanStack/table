import { describe, expect, test } from 'vitest'
import { flatMerge, mergeObjects } from '../src/merge-objects'

describe('Svelte option source merging', () => {
  test('preserves explicit undefined, symbols, accessors, and a custom prototype', () => {
    const customSymbol = Symbol('custom-option')
    const prototype = { inheritedOption: 'from-prototype' }
    let accessorValue = 'first'
    const source = Object.create(prototype)

    Object.defineProperties(source, {
      optional: {
        configurable: true,
        enumerable: true,
        value: undefined,
        writable: true,
      },
      customOption: {
        configurable: true,
        enumerable: true,
        get: () => accessorValue,
      },
      [customSymbol]: {
        configurable: true,
        enumerable: false,
        value: 'symbol-value',
      },
    })

    const merged = mergeObjects({ optional: 'fallback' }, source)

    expect(merged.optional).toBeUndefined()
    expect(Object.getPrototypeOf(merged)).toBe(prototype)
    expect(merged[customSymbol]).toBe('symbol-value')
    expect(
      Object.getOwnPropertyDescriptor(merged, 'customOption')?.get,
    ).toEqual(expect.any(Function))

    accessorValue = 'second'
    expect(merged.customOption).toBe('second')

    const snapshot = flatMerge({ optional: 'fallback' }, source)
    expect(snapshot.optional).toBeUndefined()
    expect(Object.getPrototypeOf(snapshot)).toBe(prototype)
    expect(snapshot[customSymbol]).toBe('symbol-value')
    expect(snapshot.customOption).toBe('second')
  })
})
