import { describe, expect, it, vi } from 'vitest'
import { createAtom } from '@tanstack/store'
import {
  constructTable,
  coreFeatures,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
} from '../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type {
  PaginationState,
  SortingState,
  Table_Internal,
} from '../../../src'

const _features = {
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
}

function makeTable(options: any = {}) {
  return constructTable({
    _features: {
      ...coreFeatures,
      ..._features,
      coreReativityFeature: storeReactivityBindings(),
    },
    _rowModels: {},
    columns: [],
    data: [],
    ...options,
  }) as unknown as Table_Internal<typeof _features, any>
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

    it('options.state[key] takes precedence over baseAtoms', () => {
      const external: SortingState = [{ id: 'external', desc: false }]
      const table = makeTable({ state: { sorting: external } })
      // baseAtoms still holds the default
      expect(table.baseAtoms.sorting.get()).toEqual([])
      // but atoms (and downstream store) see the external value
      expect(table.atoms.sorting.get()).toEqual(external)
      expect(table.store.state.sorting).toEqual(external)
    })

    it('options.state[key] takes precedence over options.atoms[key] when the key is present', () => {
      const externalAtom = createAtom<SortingState>([
        { id: 'fromAtom', desc: true },
      ])
      const table = makeTable({
        state: { sorting: [{ id: 'fromState', desc: false }] },
        atoms: { sorting: externalAtom },
      })
      // key is in `state` → that slice wins, even if an external atom is also set
      expect(table.atoms.sorting.get()).toEqual([
        { id: 'fromState', desc: false },
      ])
      expect(table.store.state.sorting).toEqual([
        { id: 'fromState', desc: false },
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
