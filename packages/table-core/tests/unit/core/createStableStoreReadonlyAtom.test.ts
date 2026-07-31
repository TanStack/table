import { createAtom } from '@tanstack/store'
import { describe, expect, it, vi } from 'vitest'
import { createStableStoreReadonlyAtom } from '../../../src/reactivity'

describe('createStableStoreReadonlyAtom', () => {
  it('returns a function value without invoking it as a computed resolver', () => {
    const value = vi.fn()
    const atom = createStableStoreReadonlyAtom(createAtom, () => value)

    expect(atom.get()).toBe(value)
    expect(value).not.toHaveBeenCalled()
  })
})
