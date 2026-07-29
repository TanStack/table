import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'
import { createAtom } from '@tanstack/store'
import { vueReactivity } from '../../src/reactivity'

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

  test('readonly atoms update when wrapped external TanStack Store atoms update', async () => {
    const reactivity = vueReactivity()
    const external = createAtom(1)
    const wrapped = reactivity.createWritableAtom(external.get(), {
      debugName: 'wrapped',
    })
    reactivity.addSubscription(
      external.subscribe((value) => {
        wrapped.set(value)
      }),
    )
    const doubled = reactivity.createReadonlyAtom(() => wrapped.get() * 2, {
      debugName: 'doubled',
    })

    expect(doubled.get()).toBe(2)

    external.set(2)
    await nextTick()

    expect(doubled.get()).toBe(4)
  })
})
