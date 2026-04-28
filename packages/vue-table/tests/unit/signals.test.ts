import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'
import { vueReactivity } from '../../src/signals'

describe('vueReactivity', () => {
  test('creates writable and readonly atoms from Vue refs', async () => {
    const reactivity = vueReactivity()
    const count = reactivity.createWritableAtom(1, { debugName: 'count' })
    const doubled = reactivity.createReadonlyAtom(() => count.get() * 2, {
      debugName: 'doubled',
    })

    expect(count.get()).toBe(1)
    expect(doubled.get()).toBe(2)

    count.set((value) => value + 1)
    await nextTick()

    expect(count.get()).toBe(2)
    expect(doubled.get()).toBe(4)
  })
})
