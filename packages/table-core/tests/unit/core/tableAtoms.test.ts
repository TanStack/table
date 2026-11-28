import { describe, expect, it, vi } from 'vitest'
import { batch, createAtom } from '@tanstack/store'
import {
  columnFilteringFeature,
  constructTable,
  globalFilteringFeature,
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
import type { Atom, Observer } from '@tanstack/store'
import type {
  PaginationState,
  RowSelectionState,
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

    it('stages render options without publishing controlled state', () => {
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

      table_setOptions(
        internalTable,
        (options) => ({
          ...options,
          state: {
            sorting: controlled,
          },
        }),
        { syncExternalState: false },
      )

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

  describe('explicitly undefined controlled state (#5909)', () => {
    it('falls back to the slice initial default at construct', () => {
      const table = makeTable({ state: { sorting: undefined } })
      expect(table.atoms.sorting.get()).toEqual([])
      expect(table.store.state.sorting).toEqual([])
      expect(table.baseAtoms.sorting.get()).toEqual([])
    })

    it('falls back to user-provided initialState', () => {
      const table = makeTable({
        initialState: { sorting: [{ id: 'name', desc: true }] },
        state: { sorting: undefined },
      })
      expect(table.store.state.sorting).toEqual([{ id: 'name', desc: true }])
    })

    it('does not poison baseAtoms when a controlled slice becomes undefined', () => {
      const controlled: SortingState = [{ id: 'name', desc: false }]
      const table = makeTable({ state: { sorting: controlled } })
      const internalTable = table as unknown as Table_Internal<
        typeof features,
        any
      >
      expect(table.baseAtoms.sorting.get()).toBe(controlled)

      table_setOptions(internalTable, (options) => ({
        ...options,
        state: { sorting: undefined },
      }))
      expect(table.store.state.sorting).toEqual([])
      expect(table.baseAtoms.sorting.get()).toEqual([])

      // removing the key returns the slice to uncontrolled internal writes
      table_setOptions(internalTable, (options) => ({
        ...options,
        state: {},
      }))
      table.setSorting([{ id: 'age', desc: true }])
      expect(table.store.state.sorting).toEqual([{ id: 'age', desc: true }])
    })

    it('controlled globalFilter can still be cleared with undefined', () => {
      const gfFeatures = testFeatures({
        columnFilteringFeature,
        globalFilteringFeature,
      })
      const table = constructTable({
        features: gfFeatures,
        columns: [],
        data: [],
        state: { globalFilter: 'search' },
      })
      expect(table.store.state.globalFilter).toBe('search')

      table_setOptions(
        table as unknown as Table_Internal<typeof gfFeatures, any>,
        (options) => ({
          ...options,
          state: { globalFilter: undefined },
        }),
      )
      expect(table.store.state.globalFilter).toBeUndefined()
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

    function createTrackedAtom<T>(initialValue: T): Atom<T> & {
      subscriberCount: () => number
      failNextSubscribes: (count?: number, onThrow?: () => void) => void
      failNextUnsubscribes: (count?: number) => void
    } {
      let currentValue = initialValue
      let remainingSubscribeFailures = 0
      let remainingUnsubscribeFailures = 0
      let onSubscribeThrow: (() => void) | undefined
      const listeners = new Set<(value: T) => void>()

      return {
        get: () => currentValue,
        set: (updater: T | ((prev: T) => T)) => {
          const nextValue =
            typeof updater === 'function'
              ? (updater as (prev: T) => T)(currentValue)
              : updater
          if (Object.is(currentValue, nextValue)) {
            return
          }
          currentValue = nextValue
          for (const listener of [...listeners]) {
            listener(currentValue)
          }
        },
        subscribe: ((observerOrNext: Observer<T> | ((value: T) => void)) => {
          if (remainingSubscribeFailures > 0) {
            remainingSubscribeFailures--
            onSubscribeThrow?.()
            throw new Error('subscribe failed')
          }
          const listener =
            typeof observerOrNext === 'function'
              ? observerOrNext
              : (value: T) => observerOrNext.next?.(value)
          listeners.add(listener)
          return {
            unsubscribe: () => {
              listeners.delete(listener)
              if (remainingUnsubscribeFailures > 0) {
                remainingUnsubscribeFailures--
                throw new Error('unsubscribe failed')
              }
            },
          }
        }) as Atom<T>['subscribe'],
        subscriberCount: () => listeners.size,
        failNextSubscribes: (count = 1, onThrow) => {
          remainingSubscribeFailures = count
          onSubscribeThrow = onThrow
        },
        failNextUnsubscribes: (count = 1) => {
          remainingUnsubscribeFailures = count
        },
      }
    }

    it('rolls back partial external atom subscriptions on subscribe failure and allows retry', () => {
      // `table.initialState` iterates keys in order: sorting, rowSelection, pagination.
      const sorting = createTrackedAtom<SortingState>([])
      const rowSelection = createTrackedAtom<RowSelectionState>({})
      const siblingSub = rowSelection.subscribe(() => {})
      let sortingCountWhenSelectionThrew = -1
      rowSelection.failNextSubscribes(1, () => {
        sortingCountWhenSelectionThrew = sorting.subscriberCount()
      })

      const table = makeTable({
        atoms: {
          sorting,
          rowSelection,
        },
      })

      expect(sorting.subscriberCount()).toBe(0)
      expect(rowSelection.subscriberCount()).toBe(1)

      expect(() => table.store.subscribe(() => {})).toThrow('subscribe failed')

      expect(sortingCountWhenSelectionThrew).toBe(1)
      expect(sorting.subscriberCount()).toBe(0)
      expect(rowSelection.subscriberCount()).toBe(1)

      const observer = vi.fn()
      const sub = table.store.subscribe(observer)
      expect(sorting.subscriberCount()).toBe(1)
      expect(rowSelection.subscriberCount()).toBe(2)

      sorting.set([{ id: 'score', desc: true }])
      expect(observer).toHaveBeenCalled()
      expect(table.store.state.sorting).toEqual([{ id: 'score', desc: true }])

      sub.unsubscribe()
      expect(sorting.subscriberCount()).toBe(0)
      expect(rowSelection.subscriberCount()).toBe(1)

      siblingSub.unsubscribe()
      expect(sorting.subscriberCount()).toBe(0)
      expect(rowSelection.subscriberCount()).toBe(0)
    })

    it('continues releasing remaining external bridges when a cleanup throws', () => {
      // Rollback case: pagination (3rd key) fails setup; rowSelection (2nd key) throws on cleanup.
      const sortingRollback = createTrackedAtom<SortingState>([])
      const rowSelectionRollback = createTrackedAtom<RowSelectionState>({})
      rowSelectionRollback.failNextUnsubscribes(1)
      const paginationRollback = createTrackedAtom<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      paginationRollback.failNextSubscribes(1)

      const rollbackTable = makeTable({
        atoms: {
          sorting: sortingRollback,
          rowSelection: rowSelectionRollback,
          pagination: paginationRollback,
        },
      })

      expect(() => rollbackTable.store.subscribe(() => {})).toThrow(
        'subscribe failed',
      )
      expect(sortingRollback.subscriberCount()).toBe(0)
      expect(rowSelectionRollback.subscriberCount()).toBe(0)
      expect(paginationRollback.subscriberCount()).toBe(0)

      // Teardown case: sorting (1st key) throws during unsubscribe; rowSelection & pagination still release.
      const sortingTeardown = createTrackedAtom<SortingState>([])
      sortingTeardown.failNextUnsubscribes(1)
      const rowSelectionTeardown = createTrackedAtom<RowSelectionState>({})
      const paginationTeardown = createTrackedAtom<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })

      const teardownTable = makeTable({
        atoms: {
          sorting: sortingTeardown,
          rowSelection: rowSelectionTeardown,
          pagination: paginationTeardown,
        },
      })

      const sub = teardownTable.store.subscribe(() => {})
      expect(sortingTeardown.subscriberCount()).toBe(1)
      expect(rowSelectionTeardown.subscriberCount()).toBe(1)
      expect(paginationTeardown.subscriberCount()).toBe(1)

      expect(() => sub.unsubscribe()).toThrow('unsubscribe failed')
      expect(sortingTeardown.subscriberCount()).toBe(0)
      expect(rowSelectionTeardown.subscriberCount()).toBe(0)
      expect(paginationTeardown.subscriberCount()).toBe(0)
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
