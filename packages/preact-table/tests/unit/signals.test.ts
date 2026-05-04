import { describe, expect, test } from 'vitest'
import { preactReactivity } from '../../src/reactivity'

describe('preactReactivity', () => {
  test('creates writable and readonly atoms from Preact signals', () => {
    const reactivity = preactReactivity()
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
