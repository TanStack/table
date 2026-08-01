import { describe, expect, test } from 'vitest'
import { renderReactivity } from '../../src/renderReactivity'

describe('renderReactivity', () => {
  test('creates writable and readonly atoms from TanStack Store', () => {
    const reactivity = renderReactivity()
    const count = reactivity.createWritableAtom(1, { debugName: 'count' })
    const doubled = reactivity.createReadonlyAtom(() => count.get() * 2, {
      debugName: 'doubled',
    })

    expect(count.get()).toBe(1)
    expect(doubled.get()).toBe(2)

    count.set((value) => value + 1)

    expect(count.get()).toBe(2)
    expect(doubled.get()).toBe(4)
  })
})
