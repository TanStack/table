import { describe, expect, test } from 'vitest'
import { createRoot, getOwner } from 'solid-js'
import { createAtom } from '@tanstack/solid-store'
import { solidReactivity } from '../../src/reactivity'

describe('solidReactivity', () => {
  test('readonly atoms update when they read external TanStack Store atoms', () => {
    createRoot((dispose) => {
      const owner = getOwner()!
      const reactivity = solidReactivity(owner)
      const external = createAtom(1)
      const doubled = reactivity.createReadonlyAtom(() => external.get() * 2, {
        debugName: 'doubled',
      })

      expect(doubled.get()).toBe(2)

      external.set(2)

      expect(doubled.get()).toBe(4)
      dispose()
    })
  })

  test('readonly atoms preserve TanStack Store dependency tracking through .get()', () => {
    createRoot((dispose) => {
      const owner = getOwner()!
      const reactivity = solidReactivity(owner)
      const base = reactivity.createWritableAtom(1)
      const slice = reactivity.createReadonlyAtom(() => base.get(), {
        debugName: 'slice',
      })
      const store = reactivity.createReadonlyAtom(
        () => ({
          slice: slice.get(),
        }),
        { debugName: 'store' },
      )

      expect(store.get()).toEqual({ slice: 1 })

      base.set(2)

      expect(store.get()).toEqual({ slice: 2 })
      dispose()
    })
  })
})
