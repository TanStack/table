import { describe, expect, test } from 'vitest'
import { createRoot, getOwner } from 'solid-js'
import { createAtom } from '@tanstack/store'
import { stockFeatures } from '@tanstack/table-core'
import { createTable } from '../../src/createTable'
import { solidReactivity } from '../../src/reactivity'
import type { ColumnDef } from '@tanstack/table-core'

describe('solidReactivity', () => {
  test('readonly atoms update when wrapped external TanStack Store atoms update', () => {
    createRoot((dispose) => {
      const owner = getOwner()!
      const reactivity = solidReactivity(owner)
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

describe('table.Subscribe', () => {
  type Data = { id: string }
  const columns: Array<ColumnDef<typeof stockFeatures, Data>> = [
    {
      id: 'id',
      accessorKey: 'id',
    },
  ]

  test('passes table atoms to children', () => {
    createRoot((dispose) => {
      const table = createTable({
        data: [{ id: '1' }],
        columns,
        _features: stockFeatures,
        _rowModels: {},
      })
      let received: unknown

      table.Subscribe({
        children: (atoms) => {
          received = atoms
          return null
        },
      })

      expect(received).toBe(table.atoms)
      dispose()
    })
  })
})
