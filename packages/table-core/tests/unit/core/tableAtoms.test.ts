import { describe, expect, it, vi } from 'vitest'
import { batch, createAtom } from '@tanstack/store'
import {
  constructTable,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
} from '../../../src'
import { renderPhaseReactivity } from '../../../src/reactivity'
import {
  table_setOptions,
  table_syncExternalStateToBaseAtoms,
} from '../../../src/static-functions'
import { testFeatures } from '../../fixtures/features'
import type {
  PaginationState,
  SortingState,
  Table,
  TableOptions,
  Table_Internal,
} from '../../../src'

const features = testFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
})

function makeTable(
  options?: Partial<
    Omit<TableOptions<typeof features, any>, 'data' | 'columns' | 'features'>
  >,
): Table<typeof features, any> {
  return constructTable({
    features,
    columns: [],
    data: [],
    ...options,
  })
}

describe('three-layer atom architecture', () => {
  describe('baseAtoms (writable internal layer)', () => {
    it('stores initial feature state for each slice', () => {
      const table = makeTable()
      expect(table.baseAtoms.sorting.get()).toEqual([])
      expect(table.baseAtoms.pagination.get()).toEqual({
        pageIndex: 0,
        pageSize: 10,
      })
    })

    it('writes from makeStateUpdater land on baseAtoms', () => {
      const table = makeTable()
      table.setSorting([{ id: 'name', desc: false }])
      expect(table.baseAtoms.sorting.get()).toEqual([
        { id: 'name', desc: false },
      ])
    })
  })

  describe('atoms (readonly derived layer)', () => {
    it('reflects baseAtoms when no external state/atom is provided', () => {
      const table = makeTable()
      table.baseAtoms.sorting.set([{ id: 'age', desc: true }])
      expect(table.atoms.sorting.get()).toEqual([{ id: 'age', desc: true }])
    })

    it('options.state[key] syncs into baseAtoms', () => {
      const external: SortingState = [{ id: 'external', desc: false }]
      const table = makeTable({ state: { sorting: external } })
      expect(table.baseAtoms.sorting.get()).toEqual(external)
      expect(table.atoms.sorting.get()).toEqual(external)
      expect(table.store.state.sorting).toEqual(external)
    })

    it('defers options.state synchronization when bindings declare deferExternalStateSync', () => {
      const table = constructTable({
        features: {
          ...features,
          coreReactivityFeature: renderPhaseReactivity({ createAtom, batch }),
        },
        columns: [],
        data: [],
      })
      const internalTable = table as unknown as Table_Internal<
        typeof features,
        any
      >
      const controlled: SortingState = [{ id: 'controlled', desc: false }]

      table_setOptions(internalTable, (options) => ({
        ...options,
        state: {
          sorting: controlled,
        },
      }))

      // Options are current and render reads resolve the controlled value,
      // but nothing was published into the base atoms yet.
      expect(table.options.state?.sorting).toBe(controlled)
      expect(table.baseAtoms.sorting.get()).toEqual([])
      expect(table.atoms.sorting.get()).toBe(controlled)
      expect(table.store.get().sorting).toBe(controlled)

      table_syncExternalStateToBaseAtoms(internalTable, {
        sorting: controlled,
      })

      expect(table.baseAtoms.sorting.get()).toBe(controlled)
    })

    it('options.atoms[key] takes precedence over options.state[key] when both are present', () => {
      const externalAtom = createAtom<SortingState>([
        { id: 'fromAtom', desc: true },
      ])
      const table = makeTable({
        state: { sorting: [{ id: 'fromState', desc: false }] },
        atoms: { sorting: externalAtom },
      })
      expect(table.atoms.sorting.get()).toEqual([
        { id: 'fromAtom', desc: true },
      ])
      expect(table.store.state.sorting).toEqual([
        { id: 'fromAtom', desc: true },
      ])
    })

    it('external atom writes propagate to the store', () => {
      const externalAtom = createAtom<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
      })
      const table = makeTable({ atoms: { pagination: externalAtom } })
      expect(table.store.state.pagination).toEqual({
        pageIndex: 0,
        pageSize: 5,
      })
      externalAtom.set({ pageIndex: 2, pageSize: 5 })
      expect(table.atoms.pagination.get()).toEqual({
        pageIndex: 2,
        pageSize: 5,
      })
      expect(table.store.state.pagination).toEqual({
        pageIndex: 2,
        pageSize: 5,
      })
      // baseAtoms are untouched — external wins
      expect(table.baseAtoms.pagination.get()).toEqual({
        pageIndex: 0,
        pageSize: 10,
      })
    })

    it('library writes (via makeStateUpdater default) route to the external atom', () => {
      const externalAtom = createAtom<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
      })
      const table = makeTable({ atoms: { pagination: externalAtom } })

      // Simulates what a feature write does: `table.setPageIndex(3)` etc.
      table.setPageIndex(3)

      // External atom was written to directly
      expect(externalAtom.get()).toEqual({ pageIndex: 3, pageSize: 5 })
      expect(table.store.state.pagination).toEqual({
        pageIndex: 3,
        pageSize: 5,
      })
      // baseAtom stays at its initial default — external is the canonical source
      expect(table.baseAtoms.pagination.get()).toEqual({
        pageIndex: 0,
        pageSize: 10,
      })
    })
  })

  describe('store (readonly flat derived)', () => {
    it('has identical public shape to TableState', () => {
      const table = makeTable()
      const state = table.store.state
      expect(state).toHaveProperty('sorting')
      expect(state).toHaveProperty('pagination')
      expect(state).toHaveProperty('rowSelection')
    })

    it('updates subscribers when baseAtoms change', () => {
      const table = makeTable()
      const observer = vi.fn()
      const sub = table.store.subscribe(observer)
      table.baseAtoms.sorting.set([{ id: 'x', desc: false }])
      expect(observer).toHaveBeenCalled()
      expect(table.store.state.sorting).toEqual([{ id: 'x', desc: false }])
      sub.unsubscribe()
    })
  })

  describe('reset', () => {
    it('restores baseAtoms to initialState in a single batch', () => {
      const table = makeTable({
        initialState: { pagination: { pageIndex: 0, pageSize: 25 } },
      })
      table.baseAtoms.pagination.set({ pageIndex: 3, pageSize: 25 })
      table.baseAtoms.sorting.set([{ id: 'age', desc: true }])

      const observer = vi.fn()
      const sub = table.store.subscribe(observer)

      table.reset()

      // Values reset
      expect(table.baseAtoms.pagination.get()).toEqual({
        pageIndex: 0,
        pageSize: 25,
      })
      expect(table.baseAtoms.sorting.get()).toEqual([])
      // Subscriber fired exactly once (batched) despite resetting multiple slices
      expect(observer).toHaveBeenCalledTimes(1)

      sub.unsubscribe()
    })
  })
})
